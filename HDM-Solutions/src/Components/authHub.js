import React, { useEffect, useState } from "react";
import { Amplify } from 'aws-amplify';

const { Hub } = Amplify;

import { getCurrentUser } from "../utils/cognitoAuth";

import {
    ChangePassword,
    ForgotPassword,
    GoogleSignIn,
    LogIn,
    Register,
    ResendVerificationCode,
    SignOut,
    VerifyEmailWithCode,
    VerifyForgotPassword,
} from "./auth";

export default function AuthHub() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signUp":
                    console.log("User registered");
                    break;
                case "cognitoHostedUI":
                case "signIn":
                    getCurrentUser()
                        .then((userData) => {
                            setCurrentUser(userData);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    break;
                case "signOut":
                    setCurrentUser(null);
                    break;
                case "signIn_failure":
                case "cognitoHostedUI_failure":
                    console.log("Sign in failure", data);
                    break;
                default:
            }
        });

        getCurrentUser()
            .then((userData) => setCurrentUser(userData))
            .catch((err) => console.log(err));
    }, []);
    return (
        <div>
            <h1>Auth Hub</h1>
            {!currentUser && (
                <>
                    <h2>You are not signed in.</h2>
                    <LogIn />
                    <GoogleSignIn />
                    <Register />
                    <ForgotPassword />
                    <VerifyForgotPassword />
                </>
            )}
            {currentUser && (
                <>
                    <h2>Hello {currentUser["email"]}</h2>
                    <SignOut />
                </>
            )}

            {(!currentUser || !currentUser.email_verified) && (
                <>
                    <VerifyEmailWithCode />
                    <ResendVerificationCode />
                </>
            )}

            {currentUser && !currentUser.identities && (
                <>
                    <ChangePassword />
                </>
            )}
        </div>
    );
}