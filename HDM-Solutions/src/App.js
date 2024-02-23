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
import AboutPage from './Components/AboutPage/AboutPage.jsx';

function Welcome() {
    return (
        <div>
            <h3>Welcome to HDM Solutions Trucking Rewards!</h3>
            <p>
                <Link to="https://team06.auth.us-east-1.amazoncognito.com/login?client_id=6ug5o2oo8pgg3t1o9e5h81sgee&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.dl6e1xxl2eyk0.amplifyapp.com">Register or Login</Link>
                <br></br>
                <Link to="https://team06.auth.us-east-1.amazoncognito.com/logout?client_id=6ug5o2oo8pgg3t1o9e5h81sgee&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.dl6e1xxl2eyk0.amplifyapp.com">Log back out</Link>
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
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </Router>
    );
}

export default App;
