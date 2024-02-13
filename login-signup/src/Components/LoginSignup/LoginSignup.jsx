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
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);



    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setAttemptedSubmit(true);
        const userData = { firstName, lastName, email, password, licenseNum, phoneNumber, action };
        
        // Check if all required fields are filled. If not then dont proceed with fetch calls
        if (!firstName || !lastName || !email || !password || (action === "Sign Up" && (!phoneNumber || !licenseNum))) {
            return;
        }

        try {
            //Currently fetches to the locally running server that connects to the database. Will change when we have EC2 running.
            const response = await fetch('http://localhost:8081/signup', {
                method: 'POST', // or 'GET' if you're retrieving data
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            console.log(data); // Handle success
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    };
    //Function to handle switching from Login to Sign Up to clear fields
    const switchToSignUp = () => {
        setAction("Sign Up");
        // Reset all fields
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setPhoneNumber('');
        setLicense('');
        setAttemptedSubmit(false);
    };
    //Function to handle switching from Sign Up to Login to clear fields
    const switchToLogin = () => {
        setAction("Login");
        // Reset only fields not relevant to login or all if preferred
        setEmail('');
        setPassword('');
        setAttemptedSubmit(false); 
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">

                {action === "Sign Up" ? 
                <div className={`${attemptedSubmit && !firstName ? 'input-error' : 'input'}`}>
                    <img src={user_icon} alt=""/>
                    <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                </div>:<div></div>
                }
            
                {action === "Sign Up" ? 
                <div className={`${attemptedSubmit && !lastName ? 'input-error' : 'input'}`}>
                        <img src={user_icon} alt=""/>
                        <input type="Last Name" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}/>
                </div>:<div></div>
                    
                }
                {action === "Sign Up" ? 
                <div className={`${attemptedSubmit && !licenseNum ? 'input-error' : 'input'}`}>
                        <img src={password_icon} alt=""/>
                        <input type="License Number" placeholder="Trucking License Number" value={licenseNum} onChange={e => setLicense(e.target.value)}/>
                </div>:<div></div>
                }
                
                {action === "Sign Up" ? 
                <div className={`${attemptedSubmit && !phoneNumber ? 'input-error' : 'input'}`}>
                        <img src={password_icon} alt=""/>
                        <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
                </div>:<div></div>
                }
                {action === "Sign Up" || "Login" ? 
                <div className={`${attemptedSubmit && !email ? 'input-error' : 'input'}`}>
                    <img src={email_icon} alt=""/>
                    <input type="email" placeholder="Email Id" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>:<div></div>
                }
                
                
                {action === "Sign Up" || "Login" ? 
                <div className={`${attemptedSubmit && !password ? 'input-error' : 'input'}`}>
                    <img src={password_icon} alt=""/>
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                </div>:<div></div>
                }
                
            </div>
            
            <div className="submit-container">
                <button className = "submit" type="button" onClick={handleSubmit}>{action}</button>
            </div>
            
            {action === "Login"?<div className="forgot-password">Lost Password? <span>Click Here</span></div>:<div></div>}
            <div className="submit-container">
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={switchToSignUp}>Sign Up</div>
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={switchToLogin}>Login</div>
            </div>
        </div>
    );
};
export default LoginSignup;
