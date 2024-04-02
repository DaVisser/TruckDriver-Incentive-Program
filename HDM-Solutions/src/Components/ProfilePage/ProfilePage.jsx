import React, { useState, useEffect } from 'react';
import { Grid, Header, Segment, Button, Form, Message, Image } from 'semantic-ui-react';
import { getCurrentUser, fetchUserAttributes, updateUserAttributes, confirmUserAttribute, verifyCurrentUserAttributeSubmit} from 'aws-amplify/auth';

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
    const [issue, setissue] = useState('');
    const [vertificationCode, setVertificationCode] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    //const [testUserInfo, setTestUserInfo] = useState(Object);
    const [userInfo, setUserInfo] = useState(Object);
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
            //Congito Provides function to call user info. So we switched from API call to this instead.
            const userAttr = await fetchUserAttributes();
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

        const handleTicketSubmission = async () => {
            try {
              const response = await fetch('https://hj691579y6.execute-api.us-east-1.amazonaws.com/default/team06-SupportTickets', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  firstName,
                  lastName,
                  phoneNumber,
                  issue,
                }),
              });
              console.log('API Response: ', response);
              if (response.ok) {
                setSuccessMessage('Support Ticket submitted successfully.');
              } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Failed to submit support ticket.');
              }
            } catch (error) {
              console.error('Error submitting support ticket:', error);
              setErrorMessage('Failed to submit support ticket.');
            }
        };
    
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

    const handleEditLoginInfo = () => {
        setDisplaySection('editLoginInfo');
        clearErrorMessages();
    };

    const handleDeleteAccount = () => {
        setDisplaySection('deleteAccount');
        clearErrorMessages();
    };

    const handleSupportTicket = () => {
        setDisplaySection('reportIssue');
        clearErrorMessages();
    };

    const handleApplyProfileChanges = async () => {
        try{
            //Updates info using a congito given function to update attributes in Congito Userpool.
            const attributes = await updateUserAttributes({
                userAttributes: {
                  email: email,
                  gender: gender,
                  family_name: firstName,
                  given_name: lastName,
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
            setSuccessMessage('Profile changes applied successfully.');
        }catch(error){
            setErrorMessage('Unable to update profile due to unknown error. Try again later.');
            console.log(error);
        }
        
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

    const handleIssueTicket = () => {
        handleTicketSubmission();
        setSuccessMessage('Support Ticket submitted successfully.');
    }

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
                    <Button color='orange' onClick={handleSupportTicket}>Driver Issue Ticket</Button>
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
                            <Button color='blue' onClick={back}>Back</Button>
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

                    {displaySection === 'reportIssue' && (
                        <>
                            <p>Fill out the Support Ticket below to report any driver issues.</p>
                            <Form>
                                <Form.Input
                                    label='First Name'
                                    placeholder='Enter your First Name'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <Form.Input
                                    label='Last Name'
                                    placeholder='Enter your Last Name'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <Form.Input
                                    label='Phone Number'
                                    placeholder='Enter your Phone Number'
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <Form.Input
                                    label='Issue'
                                    placeholder='Describe your issue'
                                    value={issue}
                                    onChange={(e) => setissue(e.target.value)}
                                />

                                <Button color='red' onClick={handleIssueTicket}>Submit Support Ticket</Button>
                                <Button color='red' onClick={handleIssueTicket}>Cancel</Button>

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
