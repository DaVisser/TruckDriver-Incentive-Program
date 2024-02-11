import React, { useState } from 'react';
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [licenseNum, setLicense] = useState('');
    return (
        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">

                {action === "Sign Up" ? 
                <div className="input">
                        <img src={user_icon} alt=""/>
                        <input type="First Name" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                </div>:<div></div>
                }
                {action === "Sign Up" ? 
                <div className="input">
                        <img src={user_icon} alt=""/>
                        <input type="Last Name" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}/>
                </div>:<div></div>
                    
                }
                {action === "Sign Up" ? 
                <div className="input">
                        <img src={password_icon} alt=""/>
                        <input type="License Number" placeholder="Trucking License Number" value={licenseNum} onChange={e => setLicense(e.target.value)}/>
                </div>:<div></div>
                }

                {action === "Sign Up" ? 
                <div className="input">
                        <img src={password_icon} alt=""/>
                        <input type="Phone Number" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
                </div>:<div></div>
                }
                <div className="input">
                    <img src={email_icon} alt=""/>
                    <input type="email" placeholder="Email Id" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="input">
                    <img src={password_icon} alt=""/>
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
            </div>
            {action==="Sign Up"?<div></div>:<div className="forgot-password">Lost Password? <span>Click Here</span></div>}
            <div className="submit-container">
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
            </div>
        </div>
    );
};
export default LoginSignup;
