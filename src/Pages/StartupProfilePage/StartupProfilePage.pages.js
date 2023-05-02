import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import './StartupProfilePage.pages.css';
import InnerNav from '../../Components/InnerNav/InnerNav.components';
import updateProfileData from '../../Apis/updateProfileData.apis';

const StartupProfilePage = () => {
	const dispatch = useDispatch();

	const startupProfile = useSelector((state) => state.startupProfile);

	const [updatedProfile, setUpdatedProfile] = useState(startupProfile);
	const [saveButtonLoading, setSaveButtonLoading] = useState(false);

	const saveNewProfile = async () => {
		setSaveButtonLoading(true);
		let { name, description, socialLink, mainLink, industry } = updatedProfile;

		name = name ? name.trim() : '';
		description = description ? description.trim() : '';
		socialLink = socialLink ? socialLink.trim() : '';
		mainLink = mainLink ? mainLink.trim() : '';
		industry = industry ? industry.trim() : '';

		if (name) {
			if (name.length < 2 || name.length > 15) {
				toast.error("Startup's name must be between 2 and 15 characters");
				setSaveButtonLoading(false);
				return;
			}
		}

		if (socialLink) {
			// Test url. Must start with http or https
			const urlRegex = /^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,5}/;
			if (!urlRegex.test(socialLink)) {
				toast.error(
					'Social link must be a valid url. Should start with http or https'
				);
				setSaveButtonLoading(false);
				return;
			}
		}

		if (mainLink) {
			// Test url. Must start with http or https
			const urlRegex = /^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,5}/;
			if (!urlRegex.test(mainLink)) {
				toast.error(
					'Website/App link must be a valid url. Should start with http or https'
				);
				setSaveButtonLoading(false);
				return;
			}
		}

		if (industry) {
			if (industry.length < 4 || industry.length > 15) {
				toast.error("Industry's name must be between 4 and 15 characters");
				setSaveButtonLoading(false);
				return;
			}
		}

		if (description) {
			if (description.length > 240) {
				toast.error('Description can not have more than 240 characters');
				setSaveButtonLoading(false);
				return;
			}
		}

		// if more than 1 \n is found in description, replace it with a single \n
		if (description) {
			description = description.replace(/\n\n+/g, '\n');
		}

		const updateProfileResponse = await updateProfileData({
			data: {
				name,
				description,
				socialLink,
				mainLink,
				industry,
				startupId: startupProfile.id,
			},
			profileType: 'startup',
			token: window.localStorage.getItem('token'),
		});

		if (updateProfileResponse.responseType === 'success') {
			toast.success('Profile updated successfully!');
			dispatch({
				type: 'ADD_STARTUP_PROFILE',
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
						<label className="content__fields__section__label">
							Startup's Name
						</label>
						<input
							type="text"
							name="name"
							placeholder="indiecon"
							value={updatedProfile.name}
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
							Website/App Link (Can be a demo link or a social media link)
						</label>
						<input
							type="text"
							name="mainLink"
							placeholder="https://indiecon.co"
							value={updatedProfile.mainLink}
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
							One Social Link (Twitter/LinkedIn etc.)
						</label>
						<input
							type="text"
							name="socialLink"
							placeholder="https://twitter.com/indiecon_co"
							value={updatedProfile.socialLink}
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
							Industry (Fintech/Edtech etc.)
						</label>
						<input
							type="text"
							name="industry"
							placeholder="Fintech"
							value={updatedProfile.industry}
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
							Description (240 chars max.)
						</label>
						<textarea
							name="description"
							placeholder="Your chance to boast about your startup. Describe what your startup does, what problem it solves, and what makes it unique."
							value={updatedProfile.description}
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
				</section>
			</div>
		</main>
	);
};
export default StartupProfilePage;
