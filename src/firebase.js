import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDp3FzwRQfXb0DBCFUyQfIsdXKyhL6DoUU",
    authDomain: "my-music-app-2022f.firebaseapp.com",
    projectId: "my-music-app-2022f",
    storageBucket: "my-music-app-2022f.appspot.com",
    messagingSenderId: "918508313083",
    appId: "1:918508313083:web:158fc3f27c04d4d80e535e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };