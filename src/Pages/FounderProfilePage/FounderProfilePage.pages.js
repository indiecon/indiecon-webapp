import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import './FounderProfilePage.pages.css';
import InnerNav from '../../Components/InnerNav/InnerNav.components';
import updateProfileData from '../../Apis/updateProfileData.apis';

const FounderProfilePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const founderProfile = useSelector((state) => state.founderProfile);

	const [updatedProfile, setUpdatedProfile] = useState(founderProfile);
	const [saveButtonLoading, setSaveButtonLoading] = useState(false);

	const saveNewProfile = async () => {
		setSaveButtonLoading(true);
		let { email, firstName, lastName, twitterUsername, bio } = updatedProfile;

		email = email ? email.trim() : '';
		firstName = firstName ? firstName.trim() : '';
		lastName = lastName ? lastName.trim() : '';
		twitterUsername = twitterUsername ? twitterUsername.trim() : '';
		bio = bio ? bio.trim() : '';

		if (twitterUsername) {
			// remove @ from twitter username
			if (twitterUsername[0] === '@') {
				twitterUsername = twitterUsername.slice(1);
			}

			if (twitterUsername.length > 15 || twitterUsername.length < 4) {
				toast.error('Twitter username must be between 4 and 15 characters');
				setSaveButtonLoading(false);
				return;
			}
		}

		// if first name and last name exist, check if both of them are greater than 2 chars and less than 15 chars each
		if (firstName) {
			if (firstName.length < 2 || firstName.length > 15) {
				toast.error('First name must be between 2 and 15 characters');
				setSaveButtonLoading(false);
				return;
			}
		}

		if (lastName) {
			if (lastName.length < 2 || lastName.length > 15) {
				toast.error('Last name must be between 2 and 15 characters');
				setSaveButtonLoading(false);
				return;
			}
		}

		if (bio) {
			if (bio.length > 240) {
				toast.error('Bio can not have more than 240 characters');
				setSaveButtonLoading(false);
				return;
			}
		}

		// if more than 1 \n is found in bio, replace it with a single \n
		if (bio) {
			bio = bio.replace(/\n\n+/g, '\n');
		}

		const updateProfileResponse = await updateProfileData({
			data: {
				email,
				firstName,
				lastName,
				twitterUsername,
				bio,
			},
			profileType: 'founder',
			token: window.localStorage.getItem('token'),
		});

		if (updateProfileResponse.responseType === 'success') {
			toast.success('Profile updated successfully!');
			dispatch({
				type: 'ADD_FOUNDER_PROFILE',
				payload: updateProfileResponse.responsePayload,
			});
			setSaveButtonLoading(false);
			return;
		}

		toast.error(
			updateProfileResponse.responseMessage +
				' (Error ID: ' +
				updateProfileResponse.responseId +
				')'
		);
		setSaveButtonLoading(false);
		return;
	};

	const handleLogout = () => {
		window.localStorage.removeItem('token');
		dispatch({ type: 'REMOVE_FOUNDER_PROFILE' });
		dispatch({ type: 'REMOVE_STARTUP_PROFILE' });
		dispatch({ type: 'SIGN_OUT' });
		navigate('/');
		return;
	};

	return (
		<main className="profilepage__main">
			<div className="profilepage__nav__container">
				<InnerNav
					categories={[
						{
							name: 'Founder Profile',
							link: '/founder-profile',
						},
						{
							name: 'Startup Profile',
							link: '/startup-profile',
						},
					]}
				/>
			</div>
			<div className="profilepage__content__container">
				<section className="content__fields__section">
					<div className="field__container">
						<label className="content__fields__section__label">Email</label>
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={updatedProfile.email}
							className="content__fields__section__input--disabled"
							disabled={true}
						/>
					</div>
					<div className="field__container">
						<label className="content__fields__section__label">
							First Name
						</label>
						<input
							type="text"
							name="firstName"
							placeholder="John"
							value={updatedProfile.firstName}
							className="content__fields__section__input"
							onChange={(e) => {
								setUpdatedProfile({
									...updatedProfile,
									[e.target.name]: e.target.value,
								});
							}}
						/>
					</div>
					<div className="field__container">
						<label className="content__fields__section__label">Last Name</label>
						<input
							type="text"
							name="lastName"
							placeholder="Doe"
							value={updatedProfile.lastName}
							className="content__fields__section__input"
							onChange={(e) => {
								setUpdatedProfile({
									...updatedProfile,
									[e.target.name]: e.target.value,
								});
							}}
						/>
					</div>

					<div className="field__container">
						<label className="content__fields__section__label">
							Twitter Username
						</label>
						<input
							type="text"
							name="twitterUsername"
							placeholder="@johndoe"
							value={updatedProfile.twitterUsername}
							className="content__fields__section__input"
							onChange={(e) => {
								setUpdatedProfile({
									...updatedProfile,
									[e.target.name]: e.target.value,
								});
							}}
						/>
					</div>

					<div className="field__container">
						<label className="content__fields__section__label">
							Bio (240 chars max.)
						</label>
						<textarea
							name="bio"
							placeholder="Tell people yourself. What tech stack do you use? Your past ventures?"
							value={updatedProfile.bio}
							className="content__fields__section__textarea"
							onChange={(e) => {
								setUpdatedProfile({
									...updatedProfile,
									[e.target.name]: e.target.value,
								});
							}}
							maxLength="240"
						/>
					</div>

					<p className="field__joining_date">
						You joined indiecon on {updatedProfile.createdAt.slice(0, 10)}
					</p>
				</section>
				<section className="content__last_buttons">
					{saveButtonLoading ? (
						<button className="content__last__section__button" disabled={true}>
							<p>Loading</p>
						</button>
					) : (
						<button
							className="content__last__section__button"
							onClick={saveNewProfile}
						>
							<p>Save</p>
						</button>
					)}
					<button className="content__logout__button" onClick={handleLogout}>
						<p>Logout</p>
					</button>
				</section>
			</div>
		</main>
	);
};
export default FounderProfilePage;
