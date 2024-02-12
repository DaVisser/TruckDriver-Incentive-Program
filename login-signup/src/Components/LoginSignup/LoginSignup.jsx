// import React, { useState } from 'react';
// import './LoginSignup.css';
// import user_icon from '../Assets/person.png';
// import email_icon from '../Assets/email.png';
// import password_icon from '../Assets/password.png';

// const LoginSignup = () => {
//     const [action, setAction] = useState("Login");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [firstname, setFirstname] = useState("");

//     const handleSignup = () => {
//         fetch('http://localhost:3000/signup', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password, firstname }),
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('User signed up successfully:', data);
//                 // Handle successful signup (e.g., show success message, redirect to login)
//             })
//             .catch(error => {
//                 console.error('Error signing up:', error);
//                 // Handle error (e.g., show error message)
//             });
//     };


//     return (
//         <div className='container'>
//             <div className="header">
//                 <div className="text">{action}</div>
//                 <div className="underline"></div>
//             </div>
//             <div className="inputs">
//                 <div className="input">
//                     <img src={email_icon} alt="" />
//                     <input type="email" placeholder="Email Id" value={email} onChange={e => setEmail(e.target.value)} />
//                 </div>
//                 <div className="input">
//                     <img src={password_icon} alt="" />
//                     <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//                 </div>
//                 {action === "Login" ? null :
//                     <div className="input">
//                         <img src={user_icon} alt="" />
//                         <input type="text" placeholder="Name" value={firstname} onChange={e => setFirstname(e.target.value)} />
//                     </div>
//                 }
//             </div>
//             {action === "Sign Up" ? null :
//                 <div className="forgot-password">Lost Password? <span>Click Here</span></div>
//             }
//             <div className="submit-container">
//                 <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
//                 <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
//             </div>
//             {action === "Sign Up" ? <div className="submit" onClick={handleSignup}>Submit</div> : null}
//         </div>
//     );
// };

// export default LoginSignup;

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
<<<<<<< HEAD
    const [dateOfBirth, setdateOfBirth] = useState('');
=======
>>>>>>> 5e6c5906f8be8b8cec3169d671bccf3d1240d905
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);



    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setAttemptedSubmit(true);
<<<<<<< HEAD
        const userData = { firstName, lastName, email, password, licenseNum, phoneNumber, dateOfBirth, action };

        // Check if all required fields are filled. If not then dont proceed with fetch calls
        if (!firstName || !lastName || !email || !password || !dateOfBirth || (action === "Sign Up" && (!phoneNumber || !licenseNum))) {
=======
        const userData = { firstName, lastName, email, password, licenseNum, phoneNumber, action };

        // Check if all required fields are filled. If not then dont proceed with fetch calls
        if (!firstName || !lastName || !email || !password || (action === "Sign Up" && (!phoneNumber || !licenseNum))) {
>>>>>>> 5e6c5906f8be8b8cec3169d671bccf3d1240d905
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
<<<<<<< HEAD
        setdateOfBirth('');
=======
>>>>>>> 5e6c5906f8be8b8cec3169d671bccf3d1240d905
        setAttemptedSubmit(false);
    };
    //Function to handle switching from Sign Up to Login to clear fields
    const switchToLogin = () => {
        setAction("Login");
        // Reset only fields not relevant to login or all if preferred
        setEmail('');
        setPassword('');
<<<<<<< HEAD
        setAttemptedSubmit(false);
=======
        setAttemptedSubmit(false); 
>>>>>>> 5e6c5906f8be8b8cec3169d671bccf3d1240d905
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">

<<<<<<< HEAD
                {action === "Sign Up" ? // Input for the drivers first name, located on the sign up page.
                    <div className={`${attemptedSubmit && !firstName ? 'input-error' : 'input'}`}>
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div> : <div></div>
                }

                {action === "Sign Up" ? // Input for the drivers last name, located on the sign up page.
                    <div className={`${attemptedSubmit && !lastName ? 'input-error' : 'input'}`}>
                        <img src={user_icon} alt="" />
                        <input type="Last Name" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div> : <div></div>

                }
                {action === "Sign Up" ? // Input for the drivers license number, located on the sign up page.
                    <div className={`${attemptedSubmit && !licenseNum ? 'input-error' : 'input'}`}>
                        <img src={password_icon} alt="" />
                        <input type="License Number" placeholder="Trucking License Number" value={licenseNum} onChange={e => setLicense(e.target.value)} />
                    </div> : <div></div>
                }

                {action === "Sign Up" ? // Input for the drivers phone number, located on the sign up page.
                    <div className={`${attemptedSubmit && !phoneNumber ? 'input-error' : 'input'}`}>
                        <img src={password_icon} alt="" />
                        <input type="tel" placeholder="Phone Number (123-456-7890)" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                    </div> : <div></div>
                }

                {action === "Sign Up" ? // Input for the drivers Date of Birth, located on the sign up page.
                    <div className={`${attemptedSubmit && !dateOfBirth ? 'input-error' : 'input'}`}>
                        <img src={user_icon} alt="" />
                        <input type="birthDate" placeholder="Birthdate (YYYY-MM-DD)" value={dateOfBirth} onChange={e => setdateOfBirth(e.target.value)} />
                    </div> : <div></div>
                }

                {action === "Sign Up" || "Login" ? // Input for the drivers Email Address, located on both the sign up and login page.
                    <div className={`${attemptedSubmit && !email ? 'input-error' : 'input'}`}>
                        <img src={email_icon} alt="" />
                        <input type="email" placeholder="Email Id" value={email} onChange={e => setEmail(e.target.value)} />
                    </div> : <div></div>
                }

                {action === "Sign Up" || "Login" ? // Input for the drivers account Password, located on both the sign up and login page.
                    <div className={`${attemptedSubmit && !password ? 'input-error' : 'input'}`}>
                        <img src={password_icon} alt="" />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div> : <div></div>
                }

            </div>

            <div className="submit-container">
                <button className="submit" type="button" onClick={handleSubmit}>{action}</button>
            </div>

            {action === "Login" ? <div className="forgot-password">Reset Password? <span>Click Here</span></div> : <div></div>}
            <div className="submit-container">
=======
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
>>>>>>> 5e6c5906f8be8b8cec3169d671bccf3d1240d905
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={switchToSignUp}>Sign Up</div>
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={switchToLogin}>Login</div>
            </div>
        </div>
    );
};
<<<<<<< HEAD
export default LoginSignup;
=======
export default LoginSignup;
>>>>>>> 5e6c5906f8be8b8cec3169d671bccf3d1240d905
