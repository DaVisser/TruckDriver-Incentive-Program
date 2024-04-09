import React, { useState, useEffect } from 'react';
import { Grid, Header, Segment, Button, Form, Message, Image } from 'semantic-ui-react';
import './ProfilePage.css';
import { getCurrentUser, fetchUserAttributes, updateUserAttributes, confirmUserAttribute, updatePassword} from 'aws-amplify/auth';

const ProfilePage = () => {
    const [displaySection, setDisplaySection] = useState('profile');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    
    const [tempEmail, setTempEmail] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [licenseID, setLicenseID] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [vertificationCode, setVertificationCode] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    
    const [userInfo, setUserInfo] = useState(Object);
    const [driverInfo, setDriverInfo] = useState({
        given_name: '',
        family_name: '',
        email: '',
        birthdate: '',
        phone_number: '',
        gender: '',
        LicenseID: '',
        Role: '',
        Application_Status: 'Pending'
    });

    const fetchUserInfo = async () => {
        try {
            //Congito Provides function to call user info. So we switched from API call to this instead.
            const userAttr = await fetchUserAttributes();
            console.log("Tesing: ", userAttr);
            setUserInfo(userAttr);  
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      useEffect(() => {
        fetchUserInfo();
      }, []);
      useEffect(() => {
        setDriverInfo({
            given_name: userInfo.given_name || '',
            family_name: userInfo.family_name || '',
            email: userInfo.email || '',
            birthdate: userInfo.birthdate || '',
            phone_number: userInfo.phone_number || '',
            gender: userInfo.gender || '',
            LicenseID: userInfo['custom:LicenseID'] || '',
            Role: userInfo['custom:Role'] || '',
        });
    }, [userInfo]);
    
    async function handleVertification(){
        try {
            const input = {
                confirmationCode: vertificationCode,
                userAttributeKey: 'email'
            };
            await confirmUserAttribute(input);
            
            console.log('Successfully confirmed user attributes');
            driverInfo.email = email;
            setVertificationCode('');
            setDisplaySection('profile');
          } catch (error) {
            setVertificationCode('');
            console.log(error);
            setErrorMessage('Email already registered or invalid code.');
          }
    }
    

    const back = () =>{
        setConfirmPassword('');
        setCurrentPassword('');
        setNewPassword('');
        clearErrorMessages();
        setDisplaySection('profile');
    };
    const handleUpdateProfile = () => {
        setDisplaySection('updateProfile');
        setFirstName(driverInfo.given_name);
        setLastName(driverInfo.family_name);
        setEmail(driverInfo.email);
        setBirthdate(driverInfo.birthdate);
        setPhoneNumber(driverInfo.phone_number);
        setGender(driverInfo.gender);
        setLicenseID(driverInfo.LicenseID);
        clearErrorMessages();
    };

    const handlePasswordUpdate = () => {
        setDisplaySection('updatePassword');
        clearErrorMessages();
    };

    const handleDeleteAccount = () => {
        setDisplaySection('deleteAccount');
        clearErrorMessages();
    };
    const isValidName = (name) =>{
        const re = /^[a-z ,.'-]+$/i;
        return re.test(name);
    }
    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
        return re.test(email);
      };
      
    const isValidPhoneNumber = (phoneNumber) => {
        const re = /^\+?\d{10,}$/; // Simple validation for international numbers
        return re.test(phoneNumber);
    };
    const isValidDate = (dateString) => {
        const regex = /^(?:(?:19|20)\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!dateString.match(regex)) {
          // First, check the pattern is correct
          return false;
        }
      
        // Parse the date to check its validity (e.g., no Feb 30)
        const date = new Date(dateString);
        const timestamp = date.getTime();
      
        if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
          return false;
        }
      
        return date.toISOString().startsWith(dateString);
      };
    const isValidGender = (gender) =>{
        const re = /^(Male|Female)$/i;
        return re.test(gender);
    }
    const handleApplyProfileChanges = async () => {
        try{
            let errors = [];
            if(!isValidName(firstName)){
                errors.push('Invalid first name.');
            }
            if(!isValidName(lastName)){
                errors.push('Invalid last name.');
            }
            if (!isValidEmail(email)) {
                errors.push('Invalid email format.');
            }
            if (!isValidDate(birthdate)){
                errors.push("Invalid Birthday format use YYYY-MM-DD.");
            }
            if (!isValidPhoneNumber(phoneNumber)) {
                errors.push('Invalid phone number format.');
            }  
            if(!isValidGender(gender)){
                errors.push('Invalid Gender type Male or Female.');
            }

            // Check if there were any errors collected
            if (errors.length > 0) {
                setSuccessMessage(''); 
                // Join all error messages into a single string and set it as the error message
                setErrorMessage(errors.join(' '));
                return;
            }
            
            //Updates info using a congito given function to update attributes in Congito Userpool.
            const attributes = await updateUserAttributes({
                userAttributes: {
                  email: email,
                  gender: gender,
                  family_name: lastName,
                  given_name: firstName,
                  birthdate: birthdate,
                  phone_number: phoneNumber,
                  "custom:LicenseID" : licenseID,
                },
              });
              for (const key in attributes) {
                const curr = attributes[key];
                if(!curr.isUpdated){
                        console.log('The following attribute needs further approval to update: ', key ,curr);
                        setDisplaySection('emailVertification');
                }
              }
              console.log('Response from Update: ', attributes);

              //Update info to diplay
              driverInfo.LicenseID = licenseID;
              driverInfo.given_name = firstName;
              driverInfo.family_name = lastName;
              driverInfo.birthdate = birthdate;
              driverInfo.phone_number = phoneNumber;
              driverInfo.gender = gender;
              setErrorMessage('');
              setSuccessMessage('Profile changes applied successfully.');
             
        }catch(error){
            setErrorMessage('Unable to update profile due to unknown error. Try again later.');
            console.log(error);
        }
        
    };

    function validatePassword(password) {
        const validations = [
            { check: /\d/, message: "Must contain at least 1 number." },
            { check: /[\W_]/, message: "Must contain at least 1 special character." },
            { check: /[A-Z]/, message: "Must contain at least 1 uppercase letter." },
            { check: /[a-z]/, message: "Must contain at least 1 lowercase letter." },
            { check: /.{8,}/, message: "Must be at least 8 characters long." }
        ];
    
        const errors = validations.reduce((acc, current) => {
            if (!current.check.test(password)) {
                acc.push(current.message);
            }
            return acc;
        }, []);
    
        return {
            isValid: errors.length === 0,
            errors, // This will be an array of messages for each failed validation
        };
    }

    const handleUpdatePasswordConfirm = async () => {
        try{
            const input = {
                oldPassword: currentPassword,
                newPassword: newPassword
            };
            if (newPassword !== confirmPassword) {
                setSuccessMessage(''); 
                setErrorMessage('Passwords do not match.');
                return;
            }
            if (newPassword === currentPassword) {
                setSuccessMessage(''); 
                setErrorMessage('New password must be different from current password.');
                return;
            }
            // Call validatePassword to check the new password's validity
            const { isValid, errors } = validatePassword(newPassword);
            if (!isValid) {
                setSuccessMessage(''); 
                // Join the error messages into a single string and set it as the error message
                setErrorMessage(errors.join(' '));
                return;
            }

            const response = await updatePassword(input);
            console.log("Password update response: ", response);
            setErrorMessage('');
            setSuccessMessage('Successfully updated Password');
            
        }catch(error){
            console.log(error);
            setSuccessMessage(''); 
            let message = "Failed to update password due to an error.";
            // Check if the error object has a 'message' property
            if (error.message) {
                // Extract and use the message from the error object
                message = error.message;
            } else if (typeof error === 'string') {
                // If the error is a string, use it directly
                message = error;
            }
            // Set the extracted message as the error message to display to the user
            setErrorMessage(message);
        }
    };

    const handleDeleteConfirmation = () => {
        setSuccessMessage('Account deleted successfully.');
    };

    const clearErrorMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };


    // Function to handle profile picture change
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
    };


    return (
        <Segment color="blue">
            <Grid padded>
                <Grid.Column>
                    <Header as="h1">Driver Profile</Header>

                    {/* Profile Picture */}
                    {profilePicture && <Image src={URL.createObjectURL(profilePicture)} size='medium' circular />}

                    {/* Input for profile picture */}
                    <Form.Input
                        type='file'
                        label='Profile Picture'
                        onChange={handleProfilePictureChange}
                    />

                    <Button color='blue' onClick={handleUpdateProfile}>Update Profile</Button>
                    <Button color='green' onClick={handlePasswordUpdate}>UpdatePassword</Button>
                    <Button color='red' onClick={handleDeleteAccount}>Delete Account</Button>
                    {displaySection === 'emailVertification' && (
                        <>
                            <Form>
                                <Form.Input
                                    label='Code'
                                    placeholder='Enter Code sent to the email'
                                    value={vertificationCode}
                                    onChange={(e) => setVertificationCode(e.target.value)}
                                />
                                <Button color='blue' onClick={handleVertification}>Submit Code</Button>
                                <Button color='blue' onClick={back}>Back</Button>
                            {errorMessage && (
                                <Message error content={errorMessage} />
                            )}
                            {successMessage && (
                                <Message success content={successMessage} />
                            )}
                            </Form>
                        </>
                    )}

                    {displaySection === 'profile' && (
                        <>
                            <p><strong>First Name:</strong> {driverInfo.given_name}</p>
                            <p><strong>Last Name:</strong> {driverInfo.family_name}</p>
                            <p><strong>Email:</strong> {driverInfo.email}</p>
                            <p><strong>Birthdate:</strong> {driverInfo.birthdate}</p>
                            <p><strong>Phone Number:</strong> {driverInfo.phone_number}</p>
                            <p><strong>Gender:</strong> {driverInfo.gender}</p>
                            <p><strong>License ID:</strong> {driverInfo.LicenseID}</p>
                            <p><strong>Role:</strong> {driverInfo.Role}</p>
                            <p><strong>Application Status:</strong> {driverInfo.Application_Status}</p>
                        </>
                    )}

                    {displaySection === 'updateProfile' && (
                        <Form>
                            <Form.Input
                                className="form-input"
                                label='First Name'
                                placeholder='Enter your first name'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <Form.Input
                                className="form-input"
                                label='Last Name'
                                placeholder='Enter your last name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <Form.Input
                                className="form-input"
                                label='Email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Input
                                className="form-input"
                                label='Birthdate'
                                placeholder='Enter your birthdate'
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                            />
                            <Form.Input
                                className="form-input"
                                label='Phone Number'
                                placeholder='Enter your phone number'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <Form.Input
                                className="form-input"
                                label='Gender'
                                placeholder='Enter your gender'
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <Form.Input
                                className="form-input"
                                label='License ID'
                                placeholder='Enter your license ID'
                                value={licenseID}
                                onChange={(e) => setLicenseID(e.target.value)}
                            />

                            <Button color='blue' onClick={handleApplyProfileChanges}>Apply Changes</Button>
                            <Button color='blue' onClick={back}>Back</Button>
                            {errorMessage && (
                                <div>
                                    {errorMessage.split('. ').map((error, index) => (
                                    <p key={index}>{error.trim()}.</p>
                                    ))}
                                </div>
                            )}

                            {successMessage && (
                                <Message success content={successMessage} />
                            )}
                        </Form>
                    )}

                    {displaySection === 'updatePassword' && (
                        <Form>
                            
                            <Form.Input
                                label='Current Password'
                                type='password'
                                placeholder='Enter current password'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <Form.Input
                                label='New Password'
                                type='password'
                                placeholder='Enter new password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Form.Input
                                label='Confirm New Password'
                                type='password'
                                placeholder='Retype new password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <Button color='blue' onClick={handleUpdatePasswordConfirm}>Update Password</Button>
                            <Button color='blue' onClick={back}>Back</Button>
                            {errorMessage && (
                                <div>
                                    {errorMessage.split('. ').map((error, index) => (
                                    <p key={index}>{error.trim()}.</p>
                                    ))}
                                </div>
                            )}

                            {successMessage && (
                                <Message success content={successMessage} />
                            )}
                        </Form>
                    )}

                    {displaySection === 'deleteAccount' && (
                        <>
                            <p>Are you sure you want to delete your account?</p>
                            <Form>
                                <Form.Input
                                    label='Email'
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Form.Input
                                    label='Password'
                                    type='password'
                                    placeholder='Enter your password'
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />

                                <Button color='red' onClick={handleDeleteConfirmation}>Delete Account</Button>
                                <Button color='red' onClick={handleDeleteConfirmation}>Cancel</Button>

                                {errorMessage && (
                                    <Message error content={errorMessage} />
                                )}
                                {successMessage && (
                                    <Message success content={successMessage} />
                                )}
                            </Form>
                        </>
                    )}

                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default ProfilePage;
