import { createBrowserRouter } from "react-router-dom";
import { AUTH_PATH, APP_PATH } from "./constants";
import App from "../components/App";
import Auth from "../components/Auth";

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
]);