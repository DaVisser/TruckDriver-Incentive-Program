import React from 'react';
import './HomePage.css'

const HomePage = ({ user }) => {
  // Dummy data - will replace with real data as needed
  const driverScore = 88;
  const upcomingRoutes = [
    { date: '2024-03-10', destination: 'Los Angeles' },
    { date: '2024-03-12', destination: 'San Francisco' },
  ];
  const safetyTips = 'Remember to take regular breaks to rest and stay alert.';
  const rewardsPoints = 1200;

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
      <footer className="footer">
        <p>Contact us at support@truckapp.com</p>
        {/* Additional footer content */}
      </footer>
    </div>
  );
};

export default HomePage;
