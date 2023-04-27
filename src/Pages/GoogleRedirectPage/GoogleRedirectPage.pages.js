import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import LoadingCircle from '../../Components/LoadingCircle/LoadingCircle.components';

const GoogleRedirectPage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const pathName = location.pathname;

	const queryParam = location.search;

	useEffect(() => {
		console.log(queryParam);

		if (pathName === '/google/redirect') {
			const code = queryParam.split('=')[1];
			const inviteId = window.localStorage.getItem('inviteId');
			if (code && inviteId) {
				window.localStorage.setItem('code', code);
				return navigate(`/invite/${inviteId}/?code=${code}`);
			} else {
				window.localStorage.removeItem('code');
				window.localStorage.removeItem('inviteId');
				window.localStorage.removeItem('inviteStatus');
				toast.error('Error. Please try again.');
				return navigate('/');
			}
		}
	}, [navigate, pathName, queryParam]);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '80vh',
			}}
		>
			<LoadingCircle size={10} />
		</div>
	);
};

export default GoogleRedirectPage;
