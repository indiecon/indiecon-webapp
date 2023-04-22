import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const EventPage = () => {
	const location = useLocation();

	const pathName = location.pathname;

	const queryParam = location.search;

	const handleClick = () => {
		fetch('http://localhost:8080/google')
			.then((res) => res.json())
			.then((data) => {
				window.location.href = data.url;
			});
	};

	useEffect(() => {
		if (pathName === '/event/google') {
			const code = queryParam.split('=')[1];
			if (code) {
				fetch('http://localhost:8080/google/redirect?code=' + code)
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
					});
			}
		}
	}, [pathName, queryParam]);

	return <button onClick={handleClick}>Google</button>;
};

export default EventPage;
