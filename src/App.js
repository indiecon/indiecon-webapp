import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import MainLayout from './Layouts/MainLayout/MainLayout.layouts';
import ListFoundersPage from './Pages/ListFoundersPage/ListFoundersPage.pages';
import ErrorPage from './Pages/ErrorPage/ErrorPage.pages';
import LoadingCircle from './Components/LoadingCircle/LoadingCircle.components';

import fetchFounderProfileData from './Apis/fetchFounderProfileData.apis';
import fetchStartupProfileData from './Apis/fetchStartupProfileData.apis';

function App() {
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(
		window.localStorage.getItem('token') ? true : false
	);

	useEffect(() => {
		const authToken = window.localStorage.getItem('token');
		if (!authToken || !authToken.trim()) {
			dispatch({ type: 'SIGN_OUT' });
			dispatch({ type: 'REMOVE_FOUNDER_PROFILE' });
			dispatch({ type: 'REMOVE_STARTUP_PROFILE' });
			setIsLoading(false);
			return;
		}

		// get user and startup details from backend and set them in the state
		const fetchAndProcessData = async (token) => {
			const founderProfileResponse = await fetchFounderProfileData(token);
			if (founderProfileResponse.responseType === 'error') {
				toast.error(
					founderProfileResponse.responseMessage +
						' (Error ID: ' +
						founderProfileResponse.responseId +
						')'
				);

				window.localStorage.removeItem('token');
				dispatch({ type: 'SIGN_OUT' });
				dispatch({ type: 'REMOVE_FOUNDER_PROFILE' });
				dispatch({ type: 'REMOVE_STARTUP_PROFILE' });
			}

			const startupProfileResponse = await fetchStartupProfileData(token);
			if (startupProfileResponse.responseType === 'error') {
				toast.error(
					startupProfileResponse.responseMessage +
						' (Error ID: ' +
						startupProfileResponse.responseId +
						')'
				);

				window.localStorage.removeItem('token');
				dispatch({ type: 'SIGN_OUT' });
				dispatch({ type: 'REMOVE_FOUNDER_PROFILE' });
				dispatch({ type: 'REMOVE_STARTUP_PROFILE' });
			}

			const founderProfile = founderProfileResponse.responsePayload;
			dispatch({ type: 'ADD_FOUNDER_PROFILE', payload: founderProfile });

			const startupProfile = startupProfileResponse.responsePayload;
			dispatch({ type: 'ADD_STARTUP_PROFILE', payload: startupProfile });

			dispatch({ type: 'SIGN_IN' });
			setIsLoading(false);
		};

		fetchAndProcessData(authToken);
	}, [dispatch]);

	return isLoading ? (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
		>
			<LoadingCircle size={10} />
		</div>
	) : (
		<MainLayout>
			<Routes>
				<Route path="/" element={<ListFoundersPage />} />
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</MainLayout>
	);
}

export default App;
