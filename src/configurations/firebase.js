/* eslint-disable import/no-extraneous-dependencies */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDtvyUdBYkBTbtBSY9q8i3KVIs0AWET7pk',
  authDomain: 'sdp-cw.firebaseapp.com',
  projectId: 'sdp-cw',
  storageBucket: 'sdp-cw.appspot.com',
  messagingSenderId: '795917315560',
  appId: '1:795917315560:web:ccb518b03e95ab70ab485d',
  measurementId: 'G-GHKEMY1MK5',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export {
     app, auth, database, storage,
 };
