import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { getCurrentUser } from 'aws-amplify/auth';

const HomePage = ({ user }) => {
  const [driverScore, setdriverScore] = useState();
  const upcomingRoutes = [
    { date: '2024-03-10', destination: 'Los Angeles' },
    { date: '2024-03-12', destination: 'San Francisco' },
  ];
  const safetyTips = 'Remember to take regular breaks to rest and stay alert.';
  const rewardsPoints = 1200;

  const [loginEvents, setLoginEvents] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const fetchPoints = async () => {
    try {
        const userSession = await getCurrentUser();
        const userId = userSession.userId;
      const response = await fetch('https://7u2pt3y8zd.execute-api.us-east-1.amazonaws.com/prod/UserInfo',{
        method: 'GET',
        headers: {
            Authorization: `Bearer ${userId}`,
        },
      });
      const data = await response.json();
      const points = data[0];
      setdriverScore(points.Points);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchLoginEvents = async () => {
    try {
      const response = await fetch('https://knwizrbtec.execute-api.us-east-1.amazonaws.com/dev/loginevents');
      const data = await response.json();
      setLoginEvents(data);
    } catch (error) {
      console.error('Error fetching login events:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userSession = await getCurrentUser();
      const userId = userSession.userId;
      const response = await fetch('https://7u2pt3y8zd.execute-api.us-east-1.amazonaws.com/prod/UserInfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        const userInfo = data[0];
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  useEffect(() => {
    console.log('Current user:', user); // Check if user info is available
    fetchLoginEvents();
    fetchUserInfo();
  }, []);

  return (
    <div className="dashboard">
      <header className="welcome-banner">
        <h1>Welcome!</h1>
      </header>
      <section className="driver-score">
        <h2>Your Current Score</h2>
        <p>{driverScore} points</p>
      </section>
      <section className="safety-tips">
        <h2>Safety Tips</h2>
        <p>{safetyTips}</p>
      </section>
      <section className="upcoming-routes">
        <h2>Upcoming Routes</h2>
        <ul>
          {upcomingRoutes.map(route => (
            <li key={route.date}>{`${route.date}: ${route.destination}`}</li>
          ))}
        </ul>
      </section>
      <section className="rewards">
        <h2>Rewards Points</h2>
        <p>{rewardsPoints} points</p>
      </section>
    
      {/* Conditionally render this section if the user is an admin */}
      {userInfo.Role === 'Admin' && (
        <section className="login-events"> 
            <h2>Driver Login Activity</h2>
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Login Time</th>
                </tr>
              </thead>
              <tbody>
                {loginEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{event.UserName}</td>
                    <td>{new Date(event.LoginTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
      )}

      <footer className="footer">
        <p>Contact us at support@truckapp.com</p>
        {/* Additional footer content */}
      </footer>
    </div>
  );
};

export default HomePage;
