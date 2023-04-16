import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './Layouts/MainLayout/MainLayout.layouts';
import ListFoundersPage from './Pages/ListFoundersPage/ListFoundersPage.pages';
import ErrorPage from './Pages/ErrorPage/ErrorPage.pages';
import LoadingCircle from './Components/LoadingCircle/LoadingCircle.components';

import fetchFounderProfileData from './Apis/fetchFounderProfileData.apis';
import fetchStartupProfileData from './Apis/fetchStartupProfileData.apis';

function App() {
	const [isLoading, setIsLoading] = useState(
		window.localStorage.getItem('token') ? true : false
	);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [userProfileData, setUserProfileData] = useState(null);
	const [startupProfileData, setStartupProfileData] = useState(null);

	useEffect(() => {
		const authToken = window.localStorage.getItem('token');
		if (!authToken || !authToken.trim()) {
			setIsLoading(false);
			setUserProfileData(null);
			setStartupProfileData(null);
			return;
		}

		const fetchAndProcessData = async () => {
			const userProfileResponse = await fetchFounderProfileData(authToken);

			if (userProfileResponse.responseType === 'error') {
				toast.error(
					userProfileResponse.responseMessage +
						' (Error ID: ' +
						userProfileResponse.responseId +
						')'
				);

				window.localStorage.removeItem('token');
				setUserProfileData(null);
				setStartupProfileData(null);
				return;
			}

			const startupProfileResponse = await fetchStartupProfileData(authToken);
			if (startupProfileResponse.responseType === 'error') {
				toast.error(
					startupProfileResponse.responseMessage +
						' (Error ID: ' +
						startupProfileResponse.responseId +
						')'
				);

				window.localStorage.removeItem('token');
				setUserProfileData(null);
				setStartupProfileData(null);
				return;
			}

			setUserProfileData(userProfileResponse.responsePayload);
			setStartupProfileData(startupProfileResponse.responsePayload);
			setIsUserLoggedIn(true);
			setIsLoading(false);
		};

		fetchAndProcessData();
	}, []);

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
