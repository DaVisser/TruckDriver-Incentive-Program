import React, { useState, useEffect } from 'react';
import { Grid, Header, Segment, Button, Form, Message, Image } from 'semantic-ui-react';
import { Auth } from 'aws-amplify';

const ProfilePage = () => {
    const [displaySection, setDisplaySection] = useState('profile');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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
    const [profilePicture, setProfilePicture] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [driverInfo, setDriverInfo] = useState({
        given_name: 'test',
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
          //const session = await Auth.currentSession();
          const token = 'PlaceHolder';
          const response = await fetch('https://7u2pt3y8zd.execute-api.us-east-1.amazonaws.com/prod/UserInfo',{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.length > 0) {
            // Assuming data is an array of users, and you're interested in the first one
            const user = data[0];
            console.log('Fetched user:', user); // Inspect the user
            setUserInfo(user); // Save the user object to state
            } else {
                console.log('No user data returned');
            }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      useEffect(() => {
        fetchUserInfo();
      }, []);
      useEffect(() => {
        setDriverInfo({
            given_name: userInfo.FirstName || '',
            family_name: userInfo.LastName || '',
            email: userInfo.Email || '',
            birthdate: userInfo.DateOfBirth ? userInfo.DateOfBirth.split("T")[0] : '',
            phone_number: userInfo.PhoneNumber || '',
            gender: userInfo.Gender || '',
            LicenseID: userInfo.TruckingLicense || '',
            Role: userInfo.Role || '',
        });
    }, [userInfo]);
    

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

    const handleEditLoginInfo = () => {
        setDisplaySection('editLoginInfo');
        clearErrorMessages();
    };

    const handleDeleteAccount = () => {
        setDisplaySection('deleteAccount');
        clearErrorMessages();
    };

    const handleApplyProfileChanges = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setBirthdate('');
        setPhoneNumber('');
        setGender('');
        setLicenseID('');
        setSuccessMessage('Profile changes applied successfully.');
    };

    const handleApplyLoginChanges = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMessage('Login information updated successfully.');
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
                    <Button color='green' onClick={handleEditLoginInfo}>Edit Login Info</Button>
                    <Button color='red' onClick={handleDeleteAccount}>Delete Account</Button>

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
                                label='First Name'
                                placeholder='Enter your first name'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <Form.Input
                                label='Last Name'
                                placeholder='Enter your last name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <Form.Input
                                label='Email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Input
                                label='Birthdate'
                                placeholder='Enter your birthdate'
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                            />
                            <Form.Input
                                label='Phone Number'
                                placeholder='Enter your phone number'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <Form.Input
                                label='Gender'
                                placeholder='Enter your gender'
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <Form.Input
                                label='License ID'
                                placeholder='Enter your license ID'
                                value={licenseID}
                                onChange={(e) => setLicenseID(e.target.value)}
                            />

                            <Button color='blue' onClick={handleApplyProfileChanges}>Apply Changes</Button>

                            {errorMessage && (
                                <Message error content={errorMessage} />
                            )}
                            {successMessage && (
                                <Message success content={successMessage} />
                            )}
                        </Form>
                    )}

                    {displaySection === 'editLoginInfo' && (
                        <Form>
                            <Form.Input
                                label='Email'
                                placeholder='Enter your email'
                                //value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Input
                                label='Current Password'
                                type='password'
                                placeholder='Enter current password'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <Form.Input
                                label='Email'
                                placeholder='Enter your new email'
                                //value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                            <Button color='blue' onClick={handleApplyLoginChanges}>Apply Changes</Button>

                            {errorMessage && (
                                <Message error content={errorMessage} />
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
