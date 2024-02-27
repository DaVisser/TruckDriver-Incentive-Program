/*import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react'; // Assuming you're using Semantic UI React for styling

const ProfilePage = () => {
    return (
        <Segment color="blue">
            <Grid padded>
                <Grid.Column>
                    <Header as="h1">Profile Information</Header>
                    <p>This is your profile page. You can display user information or any other relevant content here.</p>
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default ProfilePage;
*/

import React from 'react';
import { Grid, Header, Segment, Button } from 'semantic-ui-react';

const ProfilePage = () => {
    const driverInfo = {
        // Fake login information
        given_name: 'John',
        family_name: 'Doe',
        email: 'john@example.com',
        birthdate: '1990-01-01',
        phone_number: '+1234567890',
        gender: 'Male',
        LicenseID: '123456789',
        Role: 'Driver'
    };

    const handleUpdateProfile = () => {
        // Implement update profile functionality here
    };

    const handleEditLoginInfo = () => {
        // Implement edit login information functionality here
    };

    const handleDeleteAccount = () => {
        // Implement delete account functionality here
    };

    return (
        <Segment color="blue">
            <Grid padded>
                <Grid.Column>
                    <Header as="h1">Driver Profile</Header>
                    <p><strong>First Name:</strong> {driverInfo.given_name}</p>
                    <p><strong>Last Name:</strong> {driverInfo.family_name}</p>
                    <p><strong>Email:</strong> {driverInfo.email}</p>
                    <p><strong>Birthdate:</strong> {driverInfo.birthdate}</p>
                    <p><strong>Phone Number:</strong> {driverInfo.phone_number}</p>
                    <p><strong>Gender:</strong> {driverInfo.gender}</p>
                    <p><strong>License ID:</strong> {driverInfo.LicenseID}</p>
                    <p><strong>Role:</strong> {driverInfo.Role}</p>
                    
                    <Button color='blue' onClick={handleUpdateProfile}>Update Profile</Button>
                    <Button color='green' onClick={handleEditLoginInfo}>Edit Login Info</Button>
                    <Button color='red' onClick={handleDeleteAccount}>Delete Account</Button>
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default ProfilePage;
