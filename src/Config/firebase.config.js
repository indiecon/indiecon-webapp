// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: 'indiecon-co.firebaseapp.com', // TODO change this to login.indiecon.co
	projectId: 'indiecon-co',
	storageBucket: 'indiecon-co.appspot.com',
	messagingSenderId: '22974101461',
	appId: '1:22974101461:web:e42a4d6c4167dd39a96f5c',
	measurementId: 'G-7V7WF818S7',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { app, analytics, auth, provider };
