import { Link } from 'react-router-dom';
import './ErrorPage.pages.css';

const ErrorPage = () => {
	return (
		<div className="error_page__container">
			<h1>404</h1>
			<h2>Page not found</h2>
			<p>Sorry, the page you are looking for does not exist.</p>
			<Link to="/">Click here to return to home.</Link>
		</div>
	);
};

export default ErrorPage;
