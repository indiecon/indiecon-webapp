import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './MainLayout.layouts.css';
import Navbar from '../../Components/Navbar/Navbar.components';

const MainLayout = ({ children }) => {
	return (
		<div className="main-layout">
			<Navbar />
			{children}
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</div>
	);
};

export default MainLayout;
