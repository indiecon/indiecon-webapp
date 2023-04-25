import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import createInvite from '../../Apis/createInvite.apis';

import './SendInvitePopup.components.css';

const SendInvitePopup = () => {
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		purposeOfMeeting: '',
		proposedMeetingDuration: '',
		meetingDateAndTimeOne: '',
		meetingDateAndTimeTwo: '',
		additionalNote: '',
	});

	const [isButtonLoading, setIsButtonLoading] = useState(false);

	const invitePopupState = useSelector((state) => state.invitePopupState);

	const handleInviteSend = () => {
		if (isButtonLoading) return;

		setIsButtonLoading(true);

		let {
			purposeOfMeeting,
			proposedMeetingDuration,
			meetingDateAndTimeOne,
			meetingDateAndTimeTwo,
			additionalNote,
		} = formData;

		if (
			!purposeOfMeeting ||
			!purposeOfMeeting.trim() ||
			!proposedMeetingDuration ||
			!proposedMeetingDuration.trim() ||
			!meetingDateAndTimeOne ||
			!meetingDateAndTimeOne.trim() ||
			!meetingDateAndTimeTwo ||
			!meetingDateAndTimeTwo.trim()
		) {
			toast.error('Please fill all the required fields');

			return setIsButtonLoading(false);
		}

		if (additionalNote) {
			additionalNote = additionalNote.trim();
			additionalNote = additionalNote.replace(/\n\n+/g, '\n');
		}

		purposeOfMeeting = purposeOfMeeting.trim();
		proposedMeetingDuration = Number(proposedMeetingDuration.trim());
		meetingDateAndTimeOne = Number(
			new Date(meetingDateAndTimeOne.trim()).getTime()
		);
		meetingDateAndTimeTwo = Number(
			new Date(meetingDateAndTimeTwo.trim()).getTime()
		);

		if (!meetingDateAndTimeOne || !meetingDateAndTimeTwo) {
			toast.error('Please enter a valid date and time');

			return setIsButtonLoading(false);
		}

		const createInviteHelper = async () => {
			const inviteResponse = await createInvite({
				authToken: window.localStorage.getItem('token') || '',
				inviteeId: invitePopupState.founderId,
				purposeOfMeeting,
				additionalNote,
				meetingDateAndTimeOne,
				meetingDateAndTimeTwo,
				proposedMeetingDuration,
			});

			if (
				inviteResponse.responseType === 'error' ||
				inviteResponse.responseCode === 404
			) {
				toast.error(
					inviteResponse.responseMessage +
						' (Error ID: ' +
						inviteResponse.responseId +
						')'
				);

				return setIsButtonLoading(false);
			}

			toast.success('Invite sent successfully');

			dispatch({
				type: 'CLOSE_SEND_INVITE_POPUP',
			});
		};

		createInviteHelper();
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<div className="modal__header">
					<h2 className="header__heading">
						Invite {invitePopupState.founderName} for a meet
					</h2>
					<p className="header__info">
						Please fill out the details for sending an invite
					</p>
					<hr className="header__hr" />
				</div>
				<div className="modal__form">
					<div className="field__container">
						<label className="content__fields__section__label">
							Purpose of meet *
						</label>
						<input
							type="text"
							name="purposeOfMeeting"
							placeholder="I want to meet because I need help with..."
							className="content__fields__section__input"
							value={formData.purposeOfMeeting}
							onChange={(e) =>
								setFormData({
									...formData,
									purposeOfMeeting: e.target.value,
								})
							}
						/>
					</div>
					<div className="field__container">
						<label className="content__fields__section__label">
							Propose the duration of meet (in minutes) *
						</label>
						<input
							type="number"
							name="proposedMeetingDuration"
							placeholder="20"
							className="content__fields__section__input"
							value={formData.proposedMeetingDuration}
							onChange={(e) =>
								setFormData({
									...formData,
									proposedMeetingDuration: e.target.value,
								})
							}
						/>
					</div>
					<div className="field__container">
						<label className="content__fields__section__label">
							Propose time 1 *
						</label>
						<input
							type="datetime-local"
							name="meetingDateAndTimeOne"
							className="content__fields__section__input"
							value={formData.meetingDateAndTimeOne}
							onChange={(e) =>
								setFormData({
									...formData,
									meetingDateAndTimeOne: e.target.value,
								})
							}
						/>
					</div>
					<div className="field__container">
						<label className="content__fields__section__label">
							Propose time 2 *
						</label>
						<input
							type="datetime-local"
							name="meetingDateAndTimeTwo"
							className="content__fields__section__input"
							value={formData.meetingDateAndTimeTwo}
							onChange={(e) =>
								setFormData({
									...formData,
									meetingDateAndTimeTwo: e.target.value,
								})
							}
						/>
					</div>
					<div className="field__container">
						<label className="content__fields__section__label">
							{`Add a message for ${invitePopupState.founderName}`}
						</label>
						<textarea
							name="additionalNote"
							placeholder="Hi, I am Aditya. I would like to meet you to discuss about..."
							className="content__fields__section__textarea"
							value={formData.additionalNote}
							onChange={(e) =>
								setFormData({
									...formData,
									additionalNote: e.target.value,
								})
							}
						/>
					</div>
					<div className="button__container">
						<button className="button button__send" onClick={handleInviteSend}>
							<p>Send Invite</p>
						</button>
						<button
							className="button button__cancel"
							onClick={
								isButtonLoading
									? null
									: () =>
											dispatch({
												type: 'CLOSE_SEND_INVITE_POPUP',
											})
							}
						>
							<p>Cancel</p>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SendInvitePopup;
