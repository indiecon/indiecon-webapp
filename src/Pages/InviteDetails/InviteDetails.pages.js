import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import queryString from 'query-string';

import './InviteDetails.pages.css';
import LoadingCircle from '../../Components/LoadingCircle/LoadingCircle.components';
import fetchInviteDetails from '../../Apis/fetchInviteDetails.apis';
import updateInviteData from '../../Apis/updateInviteStatus.apis';
import fetchGoogleAuthUrl from '../../Apis/fetchGoogleAuthUrl.apis';
import scheduleMeet from '../../Apis/scheduleMeet.apis';

const InviteDetails = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(true);
	const [userType, setUserType] = useState(''); // invitee or inviter
	const [inviteDetails, setInviteDetails] = useState({});
	const [areButtonsLoading, setAreButtonsLoading] = useState(false);

	const userSession = useSelector((state) => state.userSession.sessionActive);
	const currentFounderData = useSelector((state) => state.founderProfile);

	const handleStatusAccepted = async (status) => {
		if (areButtonsLoading) {
			return;
		}

		setAreButtonsLoading(true);

		if (status !== 'accepted1' && status !== 'accepted2') {
			setAreButtonsLoading(false);
			return;
		}

		// store invite id in local storage, also store the status(accepted1 or accepted2)
		window.localStorage.setItem(
			'inviteId',
			inviteDetails.inviteDetails.inviteId
		);

		window.localStorage.setItem('inviteStatus', status);

		// redirect to google login url that we get from backend
		const response = await fetchGoogleAuthUrl(
			window.localStorage.getItem('token')
		);

		if (response.responseType === 'error' || response.responseCode === 404) {
			toast.error(
				response.responseMessage + ' (Error ID: ' + response.responseId + ')'
			);
			setAreButtonsLoading(false);
			return;
		}

		window.location.href = response.responsePayload;
	};

	const handleStatusUpdate = async (status) => {
		if (areButtonsLoading) {
			return;
		}

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
		const { token, code } = queryString.parse(location.search);

		if (code) {
			// check if jwt is present, invite status, code is present and invite id is present in local storage
			const googleCode = window.localStorage.getItem('code');
			const authToken = window.localStorage.getItem('token');
			const inviteId = window.localStorage.getItem('inviteId');
			const inviteStatus = window.localStorage.getItem('inviteStatus');

			if (
				googleCode &&
				authToken &&
				inviteId &&
				(inviteStatus === 'accepted1' || inviteStatus === 'accepted2')
			) {
				const scheduleMeetHelper = async () => {
					const response = await scheduleMeet({
						inviteId,
						googleCode,
						token: authToken,
						meetingAcceptedDateAndTimeId:
							inviteStatus === 'accepted1'
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

					setInviteDetails((prevState) => {
						return response.responsePayload;
					});

					window.localStorage.removeItem('inviteId');
					window.localStorage.removeItem('inviteStatus');
					window.localStorage.removeItem('code');
					setAreButtonsLoading(false);
					toast.success(response.responseMessage);

					return navigate('/invite/' + inviteId);
				};

				scheduleMeetHelper();
			}
		}

		window.localStorage.removeItem('inviteId');
		window.localStorage.removeItem('inviteStatus');
		window.localStorage.removeItem('code');

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
		userSession,
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
									? `Your invite has been accepted. The meet link is ${inviteDetails.inviteDetails.meetingLink}`
									: inviteDetails.inviteDetails.inviteStatus === ''}
							</p>
							<hr className="section_content__divider" />
						</div>
						<div className="section__content">
							{inviteDetails.inviteDetails.meetingLink ? (
								<div className="section_content__item">
									<span className="section_content__item__label">
										Meeting Link
									</span>
									<p className="section_content__item__value">
										{inviteDetails.inviteDetails.meetingLink}
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
								userType === 'invitee' ? (
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
											className="section_content__item__button"
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
							{inviteDetails.inviteDetails.meetingLink ? null : (
								<div className="section_content__item">
									<span className="section_content__item__label">
										Meeting Link
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
