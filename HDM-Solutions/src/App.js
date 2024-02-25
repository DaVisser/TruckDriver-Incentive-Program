import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import { Amplify } from "aws-amplify";
import awsExports from './aws-exports';
import './App.css'
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Login from './Components/CognitoSignup/logged_in.jsx';
import Logout from './Components/CognitoSignup/logged_out.jsx';
import Index from './Components/CognitoSignup/index.jsx';
import AboutPage from './Components/AboutPage/AboutPage.jsx';

Amplify.configure(awsExports)

function Welcome() {
    return (
        <Authenticator>
        {({ signOut, user }) => (
            <main>
            <div className="App">
                <header className="App-header">
                    <button onClick={signOut}>Sign out</button>
                    <h2>My App Content</h2>
                </header>
            </div>
            </main>
        )}
        </Authenticator>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} /> 
                <Route path="/index" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </Router>
    );
}

export default withAuthenticator(App);
