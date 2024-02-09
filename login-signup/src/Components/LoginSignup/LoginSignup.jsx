import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");

    const handleSignup = () => {
        axios.post('http://localhost:3000/signup', { email, password, firstname })
            .then(response => {
                console.log(response.data);
                // Handle successful signup (e.g., show success message, redirect to login)
            })
            .catch(error => {
                console.error('Error signing up:', error);
                // Handle error (e.g., show error message)
            });
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email Id" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                {action === "Login" ? null :
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder="Name" value={firstname} onChange={e => setFirstname(e.target.value)} />
                    </div>
                }
            </div>
            {action === "Sign Up" ? null :
                <div className="forgot-password">Lost Password? <span>Click Here</span></div>
            }
            <div className="submit-container">
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
            </div>
            {action === "Sign Up" ? <div className="submit" onClick={handleSignup}>Submit</div> : null}
        </div>
    );
};

export default LoginSignup;
