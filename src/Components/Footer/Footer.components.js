import './Footer.components.css';

const Footer = () => {
	return (
		<footer className="footer__container">
			<p className="footer__text">
				indiecon is a project by{' '}
				<a
					className="text__link-twitter"
					href="https://shimy.in/twitter"
					target="_blank"
					rel="noreferrer"
				>
					@adityakrishnag_
				</a>
			</p>
		</footer>
	);
};

export default Footer;
