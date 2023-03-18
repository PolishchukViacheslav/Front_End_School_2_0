import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Spinner from 'react-bootstrap/Spinner';
import { useGetToken } from "../features/helpers";
import { useNavigate } from "react-router-dom";
import { APP_PATH } from "../features/constants";
import {useEffect} from "react";

const Auth = () =>  {
	const navigate = useNavigate();
	const [{ isLoading, isError }, getToken] = useGetToken();
	const token = localStorage.getItem("token")
	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			Click to start your journey into the world of knowledge
		</Tooltip>
	);

	const handleClick = () => {
		getToken().then(data => {
			localStorage.setItem("token", data.token);
			navigate(APP_PATH);
		})
	};

	useEffect( () => {
		if (token) {
			navigate(APP_PATH);
		}
	}, []);

	return (
		<div className="d-flex justify-content-center align-items-center vh-100" >
			{isError && <div>Something went wrong try again</div>}
			<OverlayTrigger
				placement="right"
				delay={{show: 200, hide: 100}}
				overlay={renderTooltip}
			>
				<Button
					variant="success"
					onClick={handleClick}
				>
					{isLoading ? <Spinner animation="border" variant="light" size="sm"/> : "Let's start"}
				</Button>
			</OverlayTrigger>
		</div>

	);
}

export default Auth;