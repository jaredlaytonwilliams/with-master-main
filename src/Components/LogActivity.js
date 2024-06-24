import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

export const logActivity = async (uid, activity) => {
  try {
    await addDoc(collection(db, 'activities'), {
      uid,
      activity,
      timestamp: new Date()
    });
    console.log('Activity logged:', activity);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
