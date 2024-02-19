import React from 'react';
import { Link } from 'react-router-dom';

function LoggedInComponent() {
    return (
        <div>
            <h1>Congratulations!</h1>
            <p>You are logged in now!</p>
            <Link to="https://team6.auth.us-east-1.amazoncognito.com/logout?client_id=4nfvf9mnln2tv6qbf6hca9p8te&email+openid+profile&logout_uri=http%3A%2F%2Flocalhost%3A3000%2Flogout">Log back out</Link>
        </div>
    );
}

export default LoggedInComponent;
