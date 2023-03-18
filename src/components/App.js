import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {chunkArray, generateBgColorsClass, useDataApi} from "../features/helpers";
import { useNavigate } from "react-router-dom";
import { AUTH_PATH } from "../features/constants";
import {useEffect, useMemo, useRef, useState} from "react";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "./Pagination";

function App() {
    const navigate = useNavigate();
    const [{ isLoading, data }] = useDataApi('core/preview-courses', {});
    const bgClasses = useRef(null);
    const scrollBoxContent = useRef(null);
    const dataToRender = useMemo( () => {
        if(data.courses) {
            const tagsSet = new Set();

            data.courses.forEach(course => {
                if (course.tags && course.tags.length) {
                    course.tags.forEach(tag => {
                        tagsSet.add(tag)
                    })
                }
            })

            bgClasses.current = generateBgColorsClass(Array.from(tagsSet));

            return chunkArray(data.courses.reverse())
        }
        return [];
    }, [data]);
    const [activePage, setActivePage] = useState(1)

    const token = localStorage.getItem("token");

    useEffect( () => {
        if (!token) {
            navigate(AUTH_PATH);
        }
    }, []);

    useEffect(() => {
        scrollBoxContent.current &&
        scrollBoxContent.current.scrollIntoView({
            block: "start",
        });
    }, [activePage]);
    if (isLoading) {
        return (
            <Spinner animation="border" variant="light" size="sm"/>
        )
    }
    return (
        <div className="m-4">
            <Row xs={1} md={2} className="g-4" ref={scrollBoxContent}>
                {!!dataToRender.length && (
                    dataToRender[activePage - 1].map((course, idx) => (
                        <Col key={idx}>
                            <Card>
                                <Card.Header>
                                    <span className="badge bg-primary">Lessons: {course.lessonsCount}</span>
                                    <span className="mx-1 badge bg-info">Rating: {course.rating}</span>
                                    <span className={`badge ${bgClasses.current[course.tags[0]]}`}>{course.tags[0]}</span>
                                </Card.Header>
                                <Card.Img variant="top" src={course.previewImageLink + "/cover.webp"} className="rounded-0"/>
                                <Card.Body>
                                    <Card.Title>{course.title}</Card.Title>
                                    <Card.Text>
                                        {course.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
            <Pagination activePage={activePage} pagesCount={dataToRender.length} setPage={setActivePage} />
        </div>
    );
}

export default App;
