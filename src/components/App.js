import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import {chunkArray, generateBgColorsClass, useDataApi} from "../features/helpers";
import { useNavigate } from "react-router-dom";
import {AUTH_PATH } from "../features/constants";
import {useEffect, useMemo, useRef, useState} from "react";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "./Pagination";
import Course from "./Course";

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

    const [activePage, setActivePage] = useState(1);

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
            <Spinner animation="border" variant="light" />
        )
    }
    return (
        <div className="m-4">
            <Row xs={1} md={2} className="g-4" ref={scrollBoxContent}>
                {!!dataToRender.length && (
                    dataToRender[activePage - 1].map(course => (
                        <Course
                            key={course.id}
                            data={course}
                            badgeClass={bgClasses.current[course.tags[0]]}
                        />
                    ))
                )}
            </Row>
            <Pagination activePage={activePage} pagesCount={dataToRender.length} setPage={setActivePage} />
        </div>
    );
}

export default App;
