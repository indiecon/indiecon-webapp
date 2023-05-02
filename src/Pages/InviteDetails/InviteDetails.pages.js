import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import queryString from 'query-string';

import './InviteDetails.pages.css';
import LoadingCircle from '../../Components/LoadingCircle/LoadingCircle.components';
import fetchInviteDetails from '../../Apis/fetchInviteDetails.apis';
import updateInviteData from '../../Apis/updateInviteStatus.apis';
import scheduleMeet from '../../Apis/scheduleMeet.apis';

const InviteDetails = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(true);
	const [userType, setUserType] = useState(''); // invitee or inviter
	const [inviteDetails, setInviteDetails] = useState({});
	const [areButtonsLoading, setAreButtonsLoading] = useState(false);

	const currentFounderData = useSelector((state) => state.founderProfile);

	const handleStatusAccepted = async (status) => {
		if (areButtonsLoading) return;

		setAreButtonsLoading(true);

		if (status !== 'accepted1' && status !== 'accepted2') {
			setAreButtonsLoading(false);
			return;
		}

		const authToken = window.localStorage.getItem('token');
		const inviteId = inviteDetails.inviteDetails
			? inviteDetails.inviteDetails.inviteId
				? inviteDetails.inviteDetails.inviteId
				: ''
			: '';

		if (authToken && inviteId) {
			const scheduleMeetHelper = async () => {
				const response = await scheduleMeet({
					inviteId,
					token: authToken,
					meetingAcceptedDateAndTimeId:
						status === 'accepted1'
							? 'meetingDateAndTimeOne'
							: 'meetingDateAndTimeTwo',
				});

				if (
					response.responseType === 'error' ||
					response.responseCode === 404
				) {
					toast.error(
						response.responseMessage +
							' (Error ID: ' +
							response.responseId +
							')'
					);
					setAreButtonsLoading(false);
					return;
				}

				setInviteDetails(() => {
					return response.responsePayload;
				});

				setAreButtonsLoading(false);
				toast.success(response.responseMessage);

				// open a new tab to the google meet link
				window.open(
					response.responsePayload.inviteDetails.calendarLink,
					'_blank'
				);
			};

			scheduleMeetHelper();
		}
	};

	const handleStatusUpdate = async (status) => {
		if (areButtonsLoading) return;

		setAreButtonsLoading(true);
		if (status === 'canceled' || status === 'rejected') {
			// prompt user to confirm
			const confirmation = window.prompt(
				`You are ${
					status === 'canceled' ? 'cancelling' : 'rejecting'
				} the invite. Type "confirm" to confirm your action.`
			);

			if (!confirmation || confirmation.toLowerCase() !== 'confirm') {
				setAreButtonsLoading(false);
				return;
			}

			const response = await updateInviteData({
				inviteId: inviteDetails.inviteDetails.inviteId,
				status,
				token: window.localStorage.getItem('token'),
			});

			if (response.responseType === 'error' || response.responseCode === 404) {
				toast.error(
					response.responseMessage + ' (Error ID: ' + response.responseId + ')'
				);
				setAreButtonsLoading(false);
				return;
			}

			setInviteDetails((prevState) => {
				return {
					...prevState,
					inviteDetails: {
						...prevState.inviteDetails,
						inviteStatus: status,
					},
				};
			});

			setAreButtonsLoading(false);
			return toast.success(response.responseMessage);
		}
	};

	useEffect(() => {
		const inviteId = location.pathname ? location.pathname.split('/')[2] : '';
		const { token } = queryString.parse(location.search);

		if (token) {
			window.localStorage.setItem('token', token);
			return navigate('/invite/' + inviteId);
		}

		if (!inviteId || !window.localStorage.getItem('token')) {
			return navigate('/');
		}

		const authToken = window.localStorage.getItem('token')
			? window.localStorage.getItem('token')
			: '';

		// get invite details
		const fetchInviteData = async ({ inviteId, authToken }) => {
			const response = await fetchInviteDetails({ inviteId, authToken });

			if (response.responseType === 'error' || response.responseCode === 404) {
				toast.error(
					response.responseMessage + ' (Error ID: ' + response.responseId + ')'
				);

				window.localStorage.removeItem('token');
				dispatch({ type: 'SIGN_OUT' });
				dispatch({ type: 'REMOVE_FOUNDER_PROFILE' });
				dispatch({ type: 'REMOVE_STARTUP_PROFILE' });

				setIsLoading(false);

				return navigate('/');
			}

			const inviterId = response.responsePayload.inviterDetails.inviterId;
			const inviteeId = response.responsePayload.inviteeDetails.inviteeId;

			const currentFounderId = currentFounderData.id;

			if (inviterId === currentFounderId) setUserType('inviter');
			else if (inviteeId === currentFounderId) setUserType('invitee');

			setInviteDetails(response.responsePayload);

			setIsLoading(false);
		};

		fetchInviteData({ inviteId, authToken });
	}, [
		currentFounderData.id,
		dispatch,
		location.pathname,
		location.search,
		navigate,
	]);

	return (
		<>
			{isLoading ? (
				<div className="invite_details__loading_container">
					<LoadingCircle size={10} />
				</div>
			) : (
				<div className="invite_details__container">
					<section className="invite_details__section">
						<div className="section__header">
							<h1 className="section__heading">Invite Details</h1>
							<p className="section__description">
								{inviteDetails.inviteDetails.inviteStatus === 'pending'
									? 'Your invite is pending'
									: inviteDetails.inviteDetails.inviteStatus === 'rejected'
									? 'Your invite has been rejected'
									: inviteDetails.inviteDetails.inviteStatus === 'canceled'
									? 'Your invite has been canceled'
									: inviteDetails.inviteDetails.inviteStatus === 'accepted'
									? `Your invite has been accepted. The calendar link is ${inviteDetails.inviteDetails.calendarLink}`
									: inviteDetails.inviteDetails.inviteStatus === ''}
							</p>
							<hr className="section_content__divider" />
						</div>
						<div className="section__content">
							{inviteDetails.inviteDetails.calendarLink ? (
								<div className="section_content__item">
									<span className="section_content__item__label">
										Calendar Link
									</span>
									<p className="section_content__item__value">
										<a
											href={inviteDetails.inviteDetails.calendarLink}
											target="_blank"
											rel="noreferrer"
										>
											{inviteDetails.inviteDetails.calendarLink}
										</a>
									</p>
								</div>
							) : null}
							{inviteDetails.inviteDetails.inviteStatus === 'accepted' ? (
								<div className="section_content__item">
									<span className="section_content__item__label">
										Meeting Date and Time
									</span>
									<p className="section_content__item__value">
										{inviteDetails.inviteDetails.meetingAcceptedDateAndTime ===
										'meetingDateAndTimeOne'
											? new Date(
													inviteDetails.inviteDetails.meetingDateAndTimeOne.dateAndTime
											  ).toLocaleString('en-US', {
													year: 'numeric',
													month: 'long',
													day: 'numeric',
													hour: 'numeric',
													minute: 'numeric',
													hour12: true,
											  })
											: new Date(
													inviteDetails.inviteDetails.meetingDateAndTimeTwo.dateAndTime
											  ).toLocaleString('en-US', {
													year: 'numeric',
													month: 'long',
													day: 'numeric',
													hour: 'numeric',
													minute: 'numeric',
													hour12: true,
											  })}
									</p>
								</div>
							) : null}
							{userType === 'inviter' ? (
								<div className="section_content__item">
									<span className="section_content__item__label">Invitee</span>
									<p className="section_content__item__value">
										{inviteDetails.inviteeDetails.inviteeFirstName}{' '}
										{inviteDetails.inviteeDetails.inviteeLastName}{' '}
										<Link
											to={'/founder/' + inviteDetails.inviteeDetails.inviteeId}
										>
											<span className="section_content__item__value__link">
												(Founder Profile)
											</span>
										</Link>
										{' | '}
										<Link
											to={'/startup/' + inviteDetails.inviteeDetails.startupId}
										>
											<span className="section_content__item__value__link">
												(Startup Profile)
											</span>
										</Link>
									</p>
								</div>
							) : (
								<div className="section_content__item">
									<span className="section_content__item__label">Inviter</span>
									<p className="section_content__item__value">
										{inviteDetails.inviterDetails.inviterFirstName}{' '}
										{inviteDetails.inviterDetails.inviterLastName}{' '}
										<Link
											to={'/founder/' + inviteDetails.inviterDetails.inviterId}
										>
											<span className="section_content__item__value__link">
												(Founder Profile)
											</span>
										</Link>
										{' | '}
										<Link
											to={'/startup/' + inviteDetails.inviterDetails.startupId}
										>
											<span className="section_content__item__value__link">
												(Startup Profile)
											</span>
										</Link>
									</p>
								</div>
							)}
							<div className="section_content__item">
								<span className="section_content__item__label">
									Proposed Meeting Duration
								</span>
								<p className="section_content__item__value">
									{inviteDetails.inviteDetails.proposedMeetingDuration} minutes
								</p>
							</div>
							<div className="section_content__item">
								<span className="section_content__item__label">
									Proposed Meeting Date and Time One
								</span>
								<p className="section_content__item__value">
									{/* convert such time format "2023-04-25T00:26:33.722Z" to human readable date and time format like 23 July, 2023 | 07:55 PM */}
									{new Date(
										inviteDetails.inviteDetails.meetingDateAndTimeOne.dateAndTime
									).toLocaleString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: 'numeric',
										minute: 'numeric',
										hour12: true,
									})}
								</p>
							</div>
							<div className="section_content__item">
								<span className="section_content__item__label">
									Proposed Meeting Date and Time Two
								</span>
								<p className="section_content__item__value">
									{/* convert such time format "2023-04-25T00:26:33.722Z" to human readable date and time format like 23 July, 2023 | 07:55 PM */}
									{new Date(
										inviteDetails.inviteDetails.meetingDateAndTimeTwo.dateAndTime
									).toLocaleString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: 'numeric',
										minute: 'numeric',
										hour12: true,
									})}
								</p>
							</div>
							{inviteDetails.inviteDetails.inviteStatus === 'pending' ? (
								areButtonsLoading ? (
									<div className="section_content__item item__buttons">
										<button
											className="section_content__item__button button__loading"
											disabled={true}
										>
											Loading ...
										</button>
									</div>
								) : userType === 'invitee' ? (
									<div className="section_content__item item__buttons">
										<button
											className="section_content__item__button"
											onClick={() => handleStatusAccepted('accepted1')}
										>
											Accept Time One
										</button>
										<button
											className="section_content__item__button"
											onClick={() => handleStatusAccepted('accepted2')}
										>
											Accept Time Two
										</button>
										<button
											className="section_content__item__button button__reject"
											onClick={() => handleStatusUpdate('rejected')}
										>
											Reject Invite
										</button>
									</div>
								) : (
									<div className="section_content__item item__buttons">
										<button
											className="section_content__item__button"
											onClick={() => handleStatusUpdate('canceled')}
										>
											Cancel Invite
										</button>
									</div>
								)
							) : null}
							<div className="section_content__item">
								<span className="section_content__item__label">
									Purpose of invite
								</span>
								<p className="section_content__item__value">
									{inviteDetails.inviteDetails.purposeOfMeeting}
								</p>
							</div>
							<div className="section_content__item">
								<span className="section_content__item__label">
									Additional Note
								</span>
								<p className="section_content__item__value">
									{inviteDetails.inviteDetails.additionalNote || 'N/A'}
								</p>
							</div>
							<div className="section_content__item">
								<span className="section_content__item__label">
									Invite Status
								</span>
								<p className="section_content__item__value">
									{inviteDetails.inviteDetails.inviteStatus}
								</p>
							</div>
							{inviteDetails.inviteDetails.calendarLink ? null : (
								<div className="section_content__item">
									<span className="section_content__item__label">
										Calendar Link
									</span>
									<p className="section_content__item__value">N/A</p>
								</div>
							)}
						</div>
					</section>
				</div>
			)}
		</>
	);
};

export default InviteDetails;
