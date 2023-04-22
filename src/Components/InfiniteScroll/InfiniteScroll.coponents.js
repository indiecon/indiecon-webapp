import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import fetchList from '../../Apis/fetchList.apis';
import './InfiniteScroll.components.css';
import LoadingCircle from '../LoadingCircle/LoadingCircle.components';
import FounderCard from '../FounderCard/FounderCard.components';
import StartupCard from '../StartupCard/StartupCard.components';

// type can be founders or startups
const InfiniteScroll = (props) => {
	const { type } = props;

	const [currentFoundersListPageNumber, setCurrentFoundersListPageNumber] =
		useState(1);
	const [currentStartupsListPageNumber, setCurrentStartupsListPageNumber] =
		useState(1);
	const [isFoundersListFinished, setIsFoundersListFinished] = useState(false);
	const [isStartupsListFinished, setIsStartupsListFinished] = useState(false);
	const [isFoundersListLoading, setIsFoundersListLoading] = useState(true);
	const [isStartupsListLoading, setIsStartupsListLoading] = useState(true);

	const [currentFoundersList, setCurrentFoundersList] = useState([]);
	const [currentStartupsList, setCurrentStartupsList] = useState([]);

	useEffect(() => {
		if (type === 'founders') {
			setCurrentFoundersList(() => []);
		}

		if (type === 'startups') {
			setCurrentStartupsList(() => []);
		}

		setCurrentFoundersListPageNumber(1);
		setCurrentStartupsListPageNumber(1);
		setIsFoundersListFinished(false);
		setIsStartupsListFinished(false);
		setIsFoundersListLoading(true);
		setIsStartupsListLoading(true);
	}, [type]);

	useEffect(() => {
		const fetchMoreElements = async () => {
			if (type === 'founders' && isFoundersListFinished) return;
			if (type === 'startups' && isStartupsListFinished) return;

			if (type === 'founders') setIsFoundersListLoading(true);
			if (type === 'startups') setIsStartupsListLoading(true);

			const responseData = await fetchList({
				type: type === 'founders' ? 'founder' : 'startup',
				page:
					type === 'founders'
						? currentFoundersListPageNumber
						: currentStartupsListPageNumber,
			});

			if (responseData.responseType === 'error') {
				toast.error(
					responseData.responseMessage +
						' (Error ID: ' +
						responseData.responseId +
						')'
				);

				if (type === 'founders') {
					setIsFoundersListLoading(false);
					setIsFoundersListFinished(true);
				}
				if (type === 'startups') {
					setIsStartupsListLoading(false);
					setIsStartupsListFinished(true);
				}

				return;
			}

			if (
				responseData.responseCode === 404 ||
				responseData.responsePayload.length === 0
			) {
				if (type === 'founders') {
					setIsFoundersListLoading(false);
					setIsFoundersListFinished(true);
				}
				if (type === 'startups') {
					setIsStartupsListLoading(false);
					setIsStartupsListFinished(true);
				}

				return;
			}

			if (type === 'founders') {
				setCurrentFoundersList(() => [...responseData.responsePayload]);
			}

			if (type === 'startups') {
				setCurrentStartupsList(() => [...responseData.responsePayload]);
			}

			if (responseData.responsePayload.length < 10) {
				if (type === 'founders') {
					setIsFoundersListLoading(false);
					setIsFoundersListFinished(true);
				}
				if (type === 'startups') {
					setIsStartupsListLoading(false);
					setIsStartupsListFinished(true);
				}

				return;
			}

			if (type === 'founders') setIsFoundersListLoading(false);
			if (type === 'startups') setIsStartupsListLoading(false);
		};

		fetchMoreElements();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentFoundersListPageNumber, currentStartupsListPageNumber, type]);

	const handleNext = () => {
		if (type === 'founders') {
			if (isFoundersListFinished) return;

			setIsFoundersListLoading(true);
			setCurrentFoundersList(() => []);
			setCurrentFoundersListPageNumber((curr) => curr + 1);
		}

		if (type === 'startups') {
			if (isStartupsListFinished) return;

			setIsStartupsListLoading(true);
			setCurrentStartupsList(() => []);
			setCurrentStartupsListPageNumber((curr) => curr + 1);
		}
	};

	const handlePrevious = () => {
		if (type === 'founders') {
			if (currentFoundersListPageNumber === 1) return;

			setIsFoundersListLoading(true);
			setCurrentFoundersList(() => []);
			setIsFoundersListFinished(false);
			setCurrentFoundersListPageNumber((curr) => curr - 1);
		}

		if (type === 'startups') {
			if (currentStartupsListPageNumber === 1) return;

			setIsStartupsListLoading(true);
			setCurrentStartupsList(() => []);
			setIsStartupsListFinished(false);
			setCurrentStartupsListPageNumber((curr) => curr - 1);
		}
	};

	return (
		<div className="scroll__container">
			<div className="scroll__zero-results">
				{type === 'founders' &&
					!isFoundersListLoading &&
					currentFoundersList.length === 0 && (
						<h2 className="zero-results__text">No founders found :(</h2>
					)}

				{type === 'startups' &&
					!isStartupsListLoading &&
					currentStartupsList.length === 0 && (
						<h2 className="zero-results__text">No startups found :(</h2>
					)}
			</div>
			{type === 'founders' && (
				<div className="container__main">
					{currentFoundersList.map((founder) => (
						<FounderCard founder={founder} key={founder.id} />
					))}

					<div className="scroll__loading_or_message">
						{isFoundersListLoading ? (
							<div className="scroll__loading">
								<LoadingCircle size={5} />
							</div>
						) : isFoundersListFinished && currentFoundersList.length ? (
							<p className="scroll__message">No more items.</p>
						) : null}
					</div>
				</div>
			)}
			{type === 'startups' && (
				<div className="container__main">
					{currentStartupsList.map((startup) => (
						<StartupCard startup={startup} key={startup.id} />
					))}

					<div className="scroll__loading_or_message">
						{isStartupsListLoading ? (
							<div className="scroll__loading">
								<LoadingCircle size={5} />
							</div>
						) : isStartupsListFinished && currentStartupsList.length ? (
							<p className="scroll__message">No more items.</p>
						) : null}
					</div>
				</div>
			)}
			{type === 'founders' ? (
				<div className="navigation__buttons">
					{currentFoundersListPageNumber < 2 || isFoundersListLoading ? (
						<button
							className="navigation__button button--previous button--disabled"
							disabled={true}
						>
							Previous
						</button>
					) : (
						<button
							className="navigation__button button--previous"
							onClick={handlePrevious}
						>
							Previous
						</button>
					)}
					{
						<p className="navigation__page_number">
							{currentFoundersListPageNumber}
						</p>
					}
					{isFoundersListFinished || isFoundersListLoading ? (
						<button
							className="navigation__button button--next button--disabled"
							disabled={true}
						>
							Next
						</button>
					) : (
						<button
							className="navigation__button button--next"
							onClick={handleNext}
						>
							Next
						</button>
					)}
				</div>
			) : (
				<div className="navigation__buttons">
					{currentStartupsListPageNumber < 2 || isStartupsListLoading ? (
						<button
							className="navigation__button button--previous button--disabled"
							disabled={true}
						>
							Previous
						</button>
					) : (
						<button
							className="navigation__button button--previous"
							onClick={handlePrevious}
						>
							Previous
						</button>
					)}
					{
						<p className="navigation__page_number">
							{currentStartupsListPageNumber}
						</p>
					}
					{isStartupsListFinished || isStartupsListLoading ? (
						<button
							className="navigation__button button--next button--disabled"
							disabled={true}
						>
							Next
						</button>
					) : (
						<button
							className="navigation__button button--next"
							onClick={handleNext}
						>
							Next
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default InfiniteScroll;
