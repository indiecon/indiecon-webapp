import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import './FounderCard.components.css';

const FounderCard = ({ founder }) => {
	const currentFounder = useSelector((state) => state.founderProfile);
	const dispatch = useDispatch();

	const firstName = founder.firstName || '';
	const lastName = founder.lastName || '';
	const twitterUsername = founder.twitterUsername || '';
	const bio = founder.bio || '';
	const startupName = founder.startupName || '';
	const startupId = founder.startupId || '';

	const isSessionActive = useSelector(
		(state) => state.userSession.sessionActive
	);
	const startupProfile = useSelector((state) => state.startupProfile);
	const founderProfile = useSelector((state) => state.founderProfile);

	const handleOnConnect = () => {
		if (!isSessionActive) {
			toast.error('Please login to connect with founders');
			return;
		}

		// check if profile is complete
		const { firstName, lastName, twitterUsername, bio } = founderProfile;
		const { name, description, mainLink, socialLink, industry } =
			startupProfile;

		const isFounderProfileComplete =
			firstName && lastName && bio && twitterUsername;
		const isStartupProfileComplete =
			name && description && mainLink && socialLink && industry;

		if (!isFounderProfileComplete || !isStartupProfileComplete) {
			toast.error(
				'Please complete your profiles before connecting with founders'
			);
			return;
		}

		if (founder.id === currentFounder.id) {
			toast.error('You cannot connect with yourself');
			return;
		}

		dispatch({
			type: 'OPEN_SEND_INVITE_POPUP',
			payload: {
				isOpen: true,
				founderId: founder.id,
				founderName: founder.firstName + ' ' + founder.lastName,
			},
		});
	};

	return (
		<div className="founder_card__container">
			<div className="founder_card__header">
				<div className="founder_card__header__left">
					<h2 className="founder_header__founder-name">
						{firstName + ' ' + lastName}
					</h2>
					<a
						href={'https://twitter.com/' + twitterUsername}
						target="_blank"
						rel="noreferrer"
						className="founder_header__founder-twitter"
					>
						<span className="founder-twitter__link">
							{'@' + twitterUsername}
						</span>
					</a>
				</div>
				<div className="founder_card__header__right">
					{currentFounder.id === founder.id ? null : (
						<button
							className="founder_header__connect-button"
							onClick={handleOnConnect}
						>
							Connect
						</button>
					)}
				</div>
			</div>
			<div className="founder_card__pills">
				<div className="founder_pill__container">
					<Link to={`/startup/${startupId}`}>
						<p className="founder_pill__text">
							Building <span className="founder_text__link">{startupName}</span>
						</p>
					</Link>
				</div>
			</div>
			<div className="founder_card__description-container">
				<p className="founder_card__description-text">
					{/* founder.bio. Parse \n as new line (<br> tag) */}
					{bio.split('\n').map((line, index) => (
						<span key={index}>
							{line}
							<br />
						</span>
					))}
				</p>
			</div>
		</div>
	);
};

export default FounderCard;
