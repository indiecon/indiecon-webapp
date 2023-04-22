import { Link } from 'react-router-dom';

import './StartupCard.components.css';

const StartupCard = ({ startup }) => {
	const startupName = startup.startupName || startup.name || '';
	const founderId = startup.founderId || '';
	const twitterUsername = startup.twitterUsername || '';
	const mainLink = startup.mainLink || '';
	const socialLink = startup.socialLink || '';
	const industry = startup.industry || '';
	const description = startup.description || '';

	return (
		<div className="card__container">
			<div className="card__header">
				<div className="card__header__left">
					<h2 className="header__startup-name">{startupName}</h2>
					<Link to={`/founder/${founderId}`}>
						<p className="header__founder-twitter">
							by{' '}
							<span className="founder-twitter__link">
								{'@' + twitterUsername}
							</span>
						</p>
					</Link>
				</div>
				<div className="card__header__right">
					<a
						href={mainLink}
						target="_blank"
						rel="noreferrer"
						className="header__mainLink"
					>
						{mainLink}
					</a>
					<a
						href={socialLink}
						target="_blank"
						rel="noreferrer"
						className="header__socialLink"
					>
						{socialLink}
					</a>
				</div>
			</div>
			<div className="card__pills">
				<div className="pill__container">
					<p className="pill__text">{industry}</p>
				</div>
			</div>
			<div className="card__description-container">
				<p className="card__description-text">
					{/* startup.description. Parse \n as new line (<br> tag) */}
					{description.split('\n').map((line, index) => (
						<span key={index}>
							{line}
							<br />
						</span>
					))}
				</p>
			</div>
			<div className="card__header__down">
				<a
					href={mainLink}
					target="_blank"
					rel="noreferrer"
					className="header__mainLink"
				>
					{mainLink}
				</a>
				<a
					href={socialLink}
					target="_blank"
					rel="noreferrer"
					className="header__socialLink"
				>
					{socialLink}
				</a>
			</div>
		</div>
	);
};

export default StartupCard;
