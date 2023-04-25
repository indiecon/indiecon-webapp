// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: 'indiecon-tech.firebaseapp.com', // TODO change this to login.indiecon.co
	projectId: 'indiecon-tech',
	storageBucket: 'indiecon-tech.appspot.com',
	messagingSenderId: '325067307319',
	appId: '1:325067307319:web:f91dc994726d92620e02b2',
	measurementId: 'G-DYKLR6H3GB',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { app, analytics, auth, provider };
