import { Link, useLocation } from 'react-router-dom';

import './InnerNav.components.css';

const InnerNav = ({ categories }) => {
	const location = useLocation();
	const pathName = location.pathname;

	return (
		<div className="innernav__main">
			{categories.map((category, index) => {
				return (
					<Link to={category.link} key={index}>
						<div
							className={
								pathName === category.link
									? 'innernav__item innernav__item--active'
									: 'innernav__item'
							}
						>
							<h3
								className={
									pathName === category.link
										? 'innernav__item__text innernav__item__text--active'
										: 'innernav__item__text'
								}
							>
								{category.name}
							</h3>
						</div>
					</Link>
				);
			})}
		</div>
	);
};

export default InnerNav;
