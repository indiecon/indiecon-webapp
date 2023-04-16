const LoadingCircle = ({ size }) => {
	const multipliedSize = size ? size * 10 : 100;

	return (
		<img
			src={require('../../Assets/SVG/Loader.svg').default}
			alt="loading"
			className="loader-main"
			width={multipliedSize}
		/>
	);
};

export default LoadingCircle;
