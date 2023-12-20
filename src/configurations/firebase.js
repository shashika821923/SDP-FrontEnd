import { initializeApp } from 'firebase/app';
import { getAuth, deleteUser } from 'firebase/auth';
import { getDatabase, ref, remove } from 'firebase/database';
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

const deleteUserById = async (userId) => {
  console.log(userId);
  const userRef = ref(database, `users/${userId}`);

  try {
    // Delete user from Firebase Authentication
    await deleteUser(auth.currentUser);

    // Delete user from Firebase Realtime Database
    remove(userRef);

    console.log('User deleted successfully.');
  } catch (error) {
    console.error('Failed to delete user:', error.message);
  }
};

export {
  app, auth, database, storage, deleteUserById,
};
