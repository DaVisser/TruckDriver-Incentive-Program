import React from 'react';
import { Link } from 'react-router-dom';

function LoggedInComponent() {
    return (
        <div>
            <h1>Congratulations!</h1>
            <p>You are logged in now!</p>
            <Link to="https://team06.auth.us-east-1.amazoncognito.com/logout?client_id=6ug5o2oo8pgg3t1o9e5h81sgee&email+openid+phone&logout_uri=http%3A%2F%2Flocalhost%3A3000%2Flogout">Log back out</Link>
        </div>
    );
}

export default LoggedInComponent;
