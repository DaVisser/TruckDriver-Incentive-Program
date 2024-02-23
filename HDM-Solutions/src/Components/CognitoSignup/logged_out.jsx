import React from 'react';
import { Link } from 'react-router-dom';

function LoggedOutComponent() {
    return (
        <div>
            <h2>You are logged out</h2>
            <Link to="https://team06.auth.us-east-1.amazoncognito.com/login?client_id=6ug5o2oo8pgg3t1o9e5h81sgee&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.dl6e1xxl2eyk0.amplifyapp.com">Log back in</Link>
            <br></br>
        </div>
    );
}

export default LoggedOutComponent;
