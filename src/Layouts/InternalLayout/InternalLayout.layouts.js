import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import './InternalLayout.layouts.css';
import MainNotice from '../../Components/MainNotice/MainNotice.components';
import InnerNav from '../../Components/InnerNav/InnerNav.components';
import InfiniteScroll from '../../Components/InfiniteScroll/InfiniteScroll.coponents';
import Footer from '../../Components/Footer/Footer.components';
import FounderCard from '../../Components/FounderCard/FounderCard.components';
import StartupCard from '../../Components/StartupCard/StartupCard.components';
import fetchPublicProfileData from '../../Apis/fetchPublicProfileData.apis';
import { toast } from 'react-toastify';

const InternalLayout = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const pathName = location.pathname;

	const isLoggedIn = useSelector((state) => state.userSession.sessionActive);
	const startupProfile = useSelector((state) => state.startupProfile);
	const founderProfile = useSelector((state) => state.founderProfile);

	const [shouldRenderMainNotice, setShouldRenderMainNotice] = useState(false);
	const [fetchedFounderProfileById, setFetchedFounderProfileById] = useState(
		{}
	);
	const [fetchedStartupProfileById, setFetchedStartupProfileById] = useState(
		{}
	);

	useEffect(() => {
		if (isLoggedIn) {
			const { firstName, lastName, twitterUsername, bio } = founderProfile;
			const { name, description, mainLink, socialLink, industry } =
				startupProfile;

			const isFounderProfileComplete =
				firstName && lastName && bio && twitterUsername;
			const isStartupProfileComplete =
				name && description && mainLink && socialLink && industry;

			if (!isFounderProfileComplete || !isStartupProfileComplete)
				setShouldRenderMainNotice(true);
		}
	}, [founderProfile, isLoggedIn, startupProfile]);

	useEffect(() => {
		if (pathName === '/startups' || pathName === '/') {
			return;
		}

		if (pathName.includes('founder')) {
			const founderId = pathName.split('/')[2];

			const fetchFounderProfileById = async () => {
				const response = await fetchPublicProfileData({
					id: founderId,
					type: 'founder',
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

					return navigate('/');
				}

				return setFetchedFounderProfileById(response.responsePayload);
			};

			fetchFounderProfileById();
		}

		if (pathName.includes('startup')) {
			const startupId = pathName.split('/')[2];

			const fetchStartupProfileById = async () => {
				const response = await fetchPublicProfileData({
					id: startupId,
					type: 'startup',
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

					return navigate('/');
				}

				return setFetchedStartupProfileById(response.responsePayload);
			};

			fetchStartupProfileById();
		}
	}, [navigate, pathName]);

	return (
		<>
			<div className="list__main-notice__container">
				{shouldRenderMainNotice && <MainNotice />}
			</div>
			<div className="list-page__container">
				<div className="list-page__inner-nav">
					<InnerNav
						categories={
							pathName === '/startups' || pathName === '/'
								? [
										{
											name: 'Founders',
											link: '/',
										},
										{
											name: 'Startups',
											link: '/startups',
										},
								  ]
								: pathName.includes('founder')
								? [
										{
											name: 'Founder',
											link: pathName,
										},
										{
											name: 'Home',
											link: '/',
										},
								  ]
								: [
										{
											name: 'Startup',
											link: pathName,
										},
										{
											name: 'Home',
											link: '/',
										},
								  ]
						}
					/>
				</div>
				{pathName === '/startups' || pathName === '/' ? (
					<div className="internal_layout">
						<InfiniteScroll type={pathName === '/' ? 'founders' : 'startups'} />
					</div>
				) : pathName.includes('founder') ? (
					<div className="internal_layout">
						<FounderCard founder={fetchedFounderProfileById} />
					</div>
				) : (
					<div className="internal_layout">
						<StartupCard startup={fetchedStartupProfileById} />
					</div>
				)}
			</div>
			<Footer />
		</>
	);
};

export default InternalLayout;
