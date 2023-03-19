import { useRef, useEffect } from 'react';
import Hls from "hls.js";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { COURSE_PATH } from "../features/constants";
import ListGroup from "react-bootstrap/ListGroup";

const Course = ({ data, badgeClass }) => {
	const videoRef = useRef(null);

	const managePreviewVideoPlayback = (action) => () => {
		if (action === "start") {
			videoRef.current.style.display = "block";
			videoRef.current.currentTime = 0
			videoRef.current.play();
		}
		if (action === "stop") {
			videoRef.current.style.display = "none";
			videoRef.current.pause();
		}
	};



	useEffect(() => {
	const video = videoRef.current;

		if (Hls.isSupported()) {
			const hls = new Hls();
			hls.loadSource(data.meta.courseVideoPreview.link)
			hls.attachMedia(video);
			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				video.play();
			});
		} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
			video.src = data.meta.courseVideoPreview.link;
			video.addEventListener("loadedmetadata", () => {
				video.play();
			});
		}
		
		const handleMouseLeave = () => {
			video.pause();
		};
		video.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			video.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [data.meta.courseVideoPreview.link]);
	return (
		<Col>
			<Card
			>
				<Card.Header>
					<span className="badge bg-primary">Lessons: {data.lessonsCount}</span>
					<span className="mx-1 badge bg-info">Rating: {data.rating}</span>
					<span className={`badge ${badgeClass}`}>{data.tags[0]}</span>
				</Card.Header>
				<div className="w-100 position-relative">
					<video
						ref={videoRef}
						muted
						style={{display: "none"}}
						className="position-absolute w-100 h-100 bg-light"
						onMouseLeave={managePreviewVideoPlayback("stop")}

					/>
					<Card.Img
						variant="top"
						src={data.previewImageLink + "/cover.webp"}
						className="rounded-0"
						onMouseEnter={managePreviewVideoPlayback("start")}
					/></div>
				<Card.Body>
					<Link to={`${COURSE_PATH}/${data.id}`}><Card.Title>{data.title}</Card.Title></Link>
					{!!data.meta.skills && <ListGroup variant="flush">
						{data.meta.skills.map(skill => (
							<ListGroup.Item key={skill}>{skill}</ListGroup.Item>
						))}
					</ListGroup>}
				</Card.Body>
			</Card>
		</Col>
	);
};

export default Course;