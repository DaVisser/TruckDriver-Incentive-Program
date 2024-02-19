import React from 'react';
import { Link } from 'react-router-dom';

function LoggedOutComponent() {
    return (
        <div>
            <h2>You are logged out</h2>
            <Link to="https://team6.auth.us-east-1.amazoncognito.com/login?client_id=4nfvf9mnln2tv6qbf6hca9p8te&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin">Log back in</Link>
            <br></br>
        </div>
    );
}

export default LoggedOutComponent;
