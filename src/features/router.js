import { createBrowserRouter } from "react-router-dom";
import {AUTH_PATH, APP_PATH, COURSE_PATH} from "./constants";
import App from "../components/App";
import Auth from "../components/Auth";
import CourseDetails from "../components/CourseDetails";

export const router = createBrowserRouter([
	{
		path: AUTH_PATH,
		element: <Auth />,
		// errorElement: <ErrorPage />,
		// children: [
		// 	{
		// 		path: "contacts/:contactId",
		// 		element: <Contact />,
		// 	},
		// ],
	},
	{
		path: APP_PATH,
		element: <App />,
	},
	{
		path: `${COURSE_PATH}/:courseId`,
		element: <CourseDetails />,
	},
]);