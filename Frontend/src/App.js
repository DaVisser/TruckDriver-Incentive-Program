// import React from "react";
// import {
//     BrowserRouter as Router,
//     Routes,
//     Route,
// } from "react-router-dom";
// import Login from './Components/CognitoSignup/logged_in.jsx';
// import Logout from './Components/CognitoSignup/logged_out.jsx';
// import Index from './Components/CognitoSignup/index.jsx';

// function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/logout" element={<Logout />} />
//                 <Route path="/index" element={<Index />} />
//             </Routes>
//         </Router>
//     );
// }

// export default App;


import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import Login from './Components/CognitoSignup/logged_in.jsx';
import Logout from './Components/CognitoSignup/logged_out.jsx';
import Index from './Components/CognitoSignup/index.jsx';

function Welcome() {
    return (
        <div>
            <h3>Welcome to HDM Solutions Trucking Rewards!</h3>
            <p>
                <Link to="https://team6.auth.us-east-1.amazoncognito.com/login?client_id=4nfvf9mnln2tv6qbf6hca9p8te&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin">Register or Login</Link>
                <br></br>
                <Link to="https://team6.auth.us-east-1.amazoncognito.com/logout?client_id=4nfvf9mnln2tv6qbf6hca9p8te&email+openid+profile&logout_uri=http%3A%2F%2Flocalhost%3A3000%2Flogout">Log back out</Link>
                <br></br>
            </p>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/index" element={<Index />} />
            </Routes>
        </Router>
    );
}

export default App;
