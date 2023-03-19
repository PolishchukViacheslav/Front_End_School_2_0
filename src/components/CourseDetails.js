import React, {useEffect, useMemo, useRef, useState} from 'react';
import Hls from "hls.js";
import { useParams } from "react-router-dom";
import { useDataApi } from "../features/helpers";
import Spinner from "react-bootstrap/Spinner";
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';



const CourseDetails = () => {
	let { courseId } = useParams();
	const [{ isLoading, data }] = useDataApi(`core/preview-courses/${courseId}`, {});

	const savedData = useMemo(() => JSON.parse(localStorage.getItem(courseId)), [courseId]);


	const [isPipEnabled, setIsPipEnabled] = useState(false);
	const [videoSrc, setVideoSrc] = useState("");
	const [activeVideoId, setActiveVideoId] = useState("");

	const videoRef = useRef(null);
	const isVideoTouched = useRef(false);
	const intervalId = useRef(null);
	
	const handlePipToggle = async () => {
		const video = videoRef.current;
		if (!video) {
			return;
		}

		if (document.pictureInPictureElement) {
			await document.exitPictureInPicture();
			setIsPipEnabled(false);
		} else {
			await video.requestPictureInPicture();
			setIsPipEnabled(true);
		}
	};
	const handleLessonClick = (lesson) => () => {
		if (lesson.status === 'locked') return;

		isVideoTouched.current = true;
		setVideoSrc(lesson.link);
		setActiveVideoId(lesson.id);
		saveVideoData();
	};

	const saveVideoData = () => {
		localStorage.setItem(courseId, JSON.stringify({
			currentTime: Math.floor(videoRef?.current?.currentTime),
			activeVideoId,
			videoSrc,
		}));
	};

	const onVideoStart = () => {
		intervalId.current = setInterval(() => {
			saveVideoData()
		}, 5000)
	};

	const videoSpeedChange = (action) => {
		const video = videoRef.current;
		if (!video) {
			return;
		}

		let step = 0.25;

		if(action === "decrease") {
			step *= -1
		}
		const newPlaybackRate = video.playbackRate + step;
		video.playbackRate = newPlaybackRate;
	}

	const handleKeyDown = (event) => {
		if (event.ctrlKey && event.code === "KeyX") {
			videoSpeedChange()
		}
		if (event.ctrlKey && event.code === "KeyZ") {
			videoSpeedChange("decrease")
		}
	};

	useEffect(() => {
		if (savedData) {
			setActiveVideoId(savedData.activeVideoId);
			setVideoSrc(savedData.videoSrc);
			videoRef.current.currentTime = savedData.currentTime;
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {

			if (intervalId.current) {
				clearInterval(intervalId.current)
			};

			document.removeEventListener("keydown", handleKeyDown);
		}
	}, []);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) {
			return;
		}

		if (Hls.isSupported()) {
			const hls = new Hls();
			hls.loadSource(videoSrc);
			hls.attachMedia(video);
			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				if (isVideoTouched.current) {
					video.play();
				}
			});
		} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = videoSrc;
			video.addEventListener('loadedmetadata', () => {
				if (isVideoTouched.current) {
					video.play();
				}
			});
		}
	}, [videoSrc]);

	useEffect( () => {
		if (data.lessons && !savedData?.activeVideoId && !savedData?.videoSrc) {
			setVideoSrc(data.lessons[0].link);
			setActiveVideoId(data.lessons[0].id);
		}
	}, [data])

	return (
		isLoading ? (
			<div className="position-absolute top-50 start-50 translate-middle-x">
				<Spinner animation="border" variant="info"/>
			</div>
		) : (
			<div className="p-2">
				<h1 className="text-info mb-4 text-center">{data.title}</h1>
				<p className="text-warning w-25 mx-auto">{data.description}</p>
				<div className="w-50 mx-auto my-4">
					<video ref={videoRef} controls className="w-100" onPlay={onVideoStart} onPause={() => clearInterval(intervalId.current)}/>
					<div className="d-flex">
						<Button variant="primary" size="sm" onClick={handlePipToggle}>
							{isPipEnabled ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'}
						</Button>
						<p className="text-bg-info rounded-2 text-light mx-auto p-2 mb-0">Press Ctrl+X to increase or Ctrl+Z to decrease playback speed by 0.25</p>
					</div>
				</div>
				<div className="d-flex justify-content-around flex-wrap  gap-1">
					{!!data.lessons && data.lessons.map(lesson => (
						<div
							key={lesson.id}
							className={`d-flex align-items-center w-25 rounded-2 overflow-hidden ${activeVideoId === lesson.id ? "border border-2 border-warning" : ""}`}
							onClick={handleLessonClick(lesson)}
							{...(lesson.status === "locked" ? {style: {filter: "grayscale(100%)"}} :  {style:{cursor: "pointer"}})}

						>
							<Image src={`${lesson.previewImageLink}/lesson-${lesson.order}.webp`} className="w-25 h-100" />
							<h2 className="text-bg-success m-0 h-100 w-100">{lesson.title}</h2>
						</div>
					))}
				</div>
			</div>
		)
	);
};

export default CourseDetails;