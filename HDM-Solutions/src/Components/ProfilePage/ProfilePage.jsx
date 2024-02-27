import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react'; // Assuming you're using Semantic UI React for styling

const ProfilePage = () => {
    return (
        <Segment color="blue">
            <Grid padded>
                <Grid.Column>
                    <Header as="h1">Profile Information</Header>
                    <p>This is your profile page. You can display user information or any other relevant content here.</p>
                    {/* You can add more content here, such as user information, buttons, etc. */}
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default ProfilePage;