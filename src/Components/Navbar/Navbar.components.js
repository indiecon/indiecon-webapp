import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import './Navbar.components.css';
import GoogleLogo from '../../Assets/SVG/GoogleLogo.svg';
import ProfileIcon from '../../Assets/SVG/ProfileIcon.svg';
import logInWithGoogle from '../../Utils/logInWithGoogle.utils';
import fetchFounderProfileData from '../../Apis/fetchFounderProfileData.apis';
import fetchStartupProfileData from '../../Apis/fetchStartupProfileData.apis';

const Navbar = () => {
	const dispatch = useDispatch();
	// state to see if login button is loading or not (login in progress or not)
	const [loginButtonLoading, setLoginButtonLoading] = useState(false);

	// get the login state from the redux store
	const isLoggedIn = useSelector((state) => state.userSession.sessionActive);

	const handleLogin = async () => {
		setLoginButtonLoading(true);
		const loginResult = await logInWithGoogle();

		if (loginResult.responseType === 'error') {
			toast.error(
				loginResult.responseMessage +
					' (Error ID: ' +
					loginResult.responseId +
					')'
			);
		}

		const { token } = loginResult.responsePayload;
		if (!token) {
			toast.error(
				'Error logging in. Please contact the team. (Error ID: ' +
					loginResult.responseId +
					')'
			);
		}

		// set the token in local storage
		window.localStorage.setItem('token', token);

		// get user and startup details from backend and set them in the state
		const fetchAndProcessData = async () => {
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

			toast.success('Logged in successfully!');

			dispatch({ type: 'SIGN_IN' });
		};

		fetchAndProcessData();

		setLoginButtonLoading(false);
	};

	return (
		<nav className="navbar">
			<div className="navbar__logo">
				<h1 className="navbar__logo__text">indiecon</h1>
			</div>
			<div className="navbar__button">
				{isLoggedIn ? (
					<button className="navbar__button__profile">
						<img
							src={ProfileIcon}
							alt="login"
							className="login__image--profile"
						/>
						<p className="profile__text">Profile</p>
					</button>
				) : loginButtonLoading ? (
					<button className="navbar__button__login--disabled" disabled>
						<img
							src={GoogleLogo}
							alt="login"
							className="login__image--google"
						/>
						<p className="login__text">Login</p>
					</button>
				) : (
					<button className="navbar__button__login" onClick={handleLogin}>
						<img
							src={GoogleLogo}
							alt="login"
							className="login__image--google"
						/>
						<p className="login__text">Login</p>
					</button>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
