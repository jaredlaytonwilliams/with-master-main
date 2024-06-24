import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { getFirestore, collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import '../App.css';

const db = getFirestore();

const RecentActivity = () => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [hasActivity, setHasActivity] = useState(false);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (auth.currentUser) {
        const user = auth.currentUser;
        console.log('Current user:', user); // Debugging log

        const activityData = await fetchUserRecentActivity(user.uid);
        console.log('Fetched activity data:', activityData); // Debugging log

        setRecentActivity(activityData);
        setHasActivity(activityData.length > 0);
      } else {
        console.log('No user is authenticated'); // Debugging log
      }
    };

    fetchRecentActivity();
  }, []);

  const fetchUserRecentActivity = async (uid) => {
    try {
      const activityQuery = query(
        collection(db, 'activities'),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(activityQuery);
      const activity = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Activity from Firestore:', activity); // Debugging log
      return activity;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  };

  const handleClearActivity = async () => {
    if (auth.currentUser) {
      const user = auth.currentUser;
      try {
        const activityQuery = query(
          collection(db, 'activities'),
          where('uid', '==', user.uid)
        );
        const querySnapshot = await getDocs(activityQuery);
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        setRecentActivity([]);
        setHasActivity(false);
        console.log('Cleared recent activity'); // Debugging log
      } catch (error) {
        console.error('Error clearing recent activity:', error);
      }
    }
  };

  if (!hasActivity) return null;

  return (
    <div className="recent-activity-container">
      <h2>Recent Activity</h2>
      <ul>
        {recentActivity.map((activity, index) => (
          <li key={activity.id}>{activity.activity}</li>
        ))}
      </ul>
      <button onClick={handleClearActivity} className="clear-button">Clear</button>
    </div>
  );
};

export default RecentActivity;
