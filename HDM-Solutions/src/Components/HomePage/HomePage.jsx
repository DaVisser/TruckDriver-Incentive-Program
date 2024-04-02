import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { getCurrentUser } from 'aws-amplify/auth'; // Make sure to import getCurrentUser

const HomePage = ({ user }) => {
  const driverScore = 88;
  const upcomingRoutes = [
    { date: '2024-03-10', destination: 'Los Angeles' },
    { date: '2024-03-12', destination: 'San Francisco' },
  ];
  const safetyTips = 'Remember to take regular breaks to rest and stay alert.';
  const rewardsPoints = 1200;

  const [loginEvents, setLoginEvents] = useState([]);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getUserNameAndRole = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        // Assuming getCurrentUser() returns the current user's attributes
        const attributes = await getCurrentUser();
        const username = attributes.username;
        setUserName(username);
        
        if (username) {
          const response = await fetch(`https://1hmxcygemd.execute-api.us-east-1.amazonaws.com/dev/user?username=${username}`);
          const data = await response.json();
          setUserRole(data.role); // Assuming the API response has a 'role' field
        }
      } catch (error) {
        console.error('Error:', error);
        setIsError(true);
      }
      setIsLoading(false);
    };
    getUserNameAndRole();
  }, []);

  useEffect(() => {
    const fetchLoginEvents = async () => {
      try {
        const response = await fetch('https://knwizrbtec.execute-api.us-east-1.amazonaws.com/dev/loginevents');
        const data = await response.json();
        setLoginEvents(data);
      } catch (error) {
        console.error('Error fetching login events:', error);
      }
    };
    if (userRole === 'Admin') {
      fetchLoginEvents();
    }
  }, [userRole]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred.</div>;

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

       {/* Conditionally render the Login Events table only if the user is an Admin */}
       {userRole === 'Admin' && (
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