// src/Components/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import { getCurrentUser} from 'aws-amplify/auth';


const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Assume loading by default
    const [isError, setIsError] = useState(false);
    const [showCreateUserForm, setShowCreateUserForm] = useState(false); // NEW: Control form visibility
    const [newUserData, setNewUserData] = useState({ // NEW: Hold new user data
        username: '',
        email: '',
        birthdate: '',
        family_name: '',
        gender: '',
        given_name: '',
        phone_number: '',
    });
    const [loginEvents, setLoginEvents] = useState([]);
    const [showLoginEvents, setShowLoginEvents] = useState(false); // NEW: Control login events visibility

    // calls a lambda function that disables a user in cognito
    const handleDeactivate = async (username) => {
        const confirmDeactivate = window.confirm(`Are you sure you want to deactivate ${username}?`);
        if (!confirmDeactivate) return;
    
        try {
            const response = await fetch('https://7ckucn4b35.execute-api.us-east-1.amazonaws.com/dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username, // expects a 'username' field in the body
                    userPoolId: 'us-east-1_2qaCHCZk4' // Include the UserPoolId
                })
            });
    
            if (!response.ok) throw new Error('Failed to deactivate user');
            
            const result = await response.json();
            alert(result.message);
    
            // Optional: Refreshes the users list by removing the deactivated user
            setUsers(users.filter(user => user.UserName !== username));
        } catch (error) {
            console.error("Error deactivating user: ", error);
            alert(`Failed to deactivate ${username}`);
        }
};    
    // Function to handle user creation
const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
        // Ensure the userPoolId is correctly included
        const userDataWithPoolId = {
            ...newUserData,
            userPoolId: 'us-east-1_2qaCHCZk4', // Confirm this is the correct User Pool ID
        };

        // If the user is a sponsor, restrict the role to 'driver' or 'sponsor'
        if (userRole === 'Sponsor') {
            const validRoles = ['driver', 'sponsor'];
            if (!validRoles.includes(newUserData.role.toLowerCase())) {
                throw new Error('Sponsor can only create users with role "driver" or "sponsor"');
            }
        }

        const response = await fetch('https://mhgex7oqei.execute-api.us-east-1.amazonaws.com/dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDataWithPoolId),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create user');
        }

        const result = await response.json();
        alert(result.message);
        setShowCreateUserForm(false); // Hide form on success

        // Optionally refresh the user list here, e.g., by calling a function that fetches the updated user list
    } catch (error) {
        console.error("Error creating user: ", error);
        alert(`Failed to create user: ${error.message}`);
    }
};
// Function to toggle display of login events table
const toggleLoginEvents = () => {
        setShowLoginEvents(!showLoginEvents);
    };

useEffect(() => {
    const getUserName = async () => {
    try {
        // Your method to get the current user's name, adjust as necessary
        const attributes = await getCurrentUser(); 
        const username = attributes.username;

        setUserName(username);
    } catch (error) {
        console.error('Error fetching user name:', error);
    }
    };
    getUserName();
}, []);
  
useEffect(() => {
    const checkUserRole = async () => {
    if (!userName) return; // Return early if userName is not set yet
    
    setIsLoading(true); // Begin loading
    setIsError(false); // Reset error state
    
    try {
        const response = await fetch(`https://1hmxcygemd.execute-api.us-east-1.amazonaws.com/dev/user?username=${userName}`);
        const data = await response.json();
        
        setUserRole(data.role); // Assuming the API response has a 'role' field
        setIsLoading(false); // Loading complete
    } catch (error) {
        console.error('Error checking user role:', error);
        setIsError(true); // Set error state
        setIsLoading(false); // Loading complete
    }
    };
    checkUserRole();
}, [userName]);

useEffect(() => {
    const fetchLoginEvents = async () => {
        try {
        const response = await fetch('https://knwizrbtec.execute-api.us-east-1.amazonaws.com/dev/loginevents');
        const data = await response.json();
        setLoginEvents(data);
        } catch (error) {
        console.error('Error fetching login events:', error);
        }
    };
    if (userRole === 'Admin') {
        fetchLoginEvents();
    }
}, [userRole]);

useEffect(() => {
    if (userRole === 'Admin' || userRole === 'Sponsor') {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://cqf7mwevac.execute-api.us-east-1.amazonaws.com/dev/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }
}, [userRole]); 

if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error occurred while fetching user role.</div>;
// Display users only if the userRole is 'Admin'
if (userRole !== 'Admin' && userRole !== 'Sponsor') return <div>You are not authorized to view this page.</div>;

return (
    <div>
        <h1>User Management</h1>
        <button className="create-user-btn" onClick={() => setShowCreateUserForm(true)}>Create User</button> {/* Create User button */}
        {showCreateUserForm && (
    <form className="create-user-form" onSubmit={handleCreateUser}>
    <label>Username</label>
    <input type="text" name="username" value={newUserData.username} onChange={e => setNewUserData({ ...newUserData, username: e.target.value })} required />

    <label>Email</label>
    <input type="email" name="email" value={newUserData.email} onChange={e => setNewUserData({ ...newUserData, email: e.target.value })} required />

    <label>First Name</label>
    <input type="text" name="given_name" value={newUserData.given_name} onChange={e => setNewUserData({ ...newUserData, given_name: e.target.value })} required />

    <label>Last Name</label>
    <input type="text" name="family_name" value={newUserData.family_name} onChange={e => setNewUserData({ ...newUserData, family_name: e.target.value })} required />

    <label>Birthdate</label>
    <input type="date" name="birthdate" value={newUserData.birthdate} onChange={e => setNewUserData({ ...newUserData, birthdate: e.target.value })} required />

    <label>Gender</label>
    <select name="gender" value={newUserData.gender} onChange={e => setNewUserData({ ...newUserData, gender: e.target.value })} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
    </select>

    <label>Phone Number</label>
    <input type="text" name="phone_number" value={newUserData.phone_number} onChange={e => setNewUserData({ ...newUserData, phone_number: e.target.value })} required />

    <label>Role</label>
    <input type="text" name="role" value={newUserData.role} onChange={e => setNewUserData({ ...newUserData, role: e.target.value })} required />

    <button type="submit" className="submit-btn">Submit</button>
</form>
)}
<div>
    <button onClick={toggleLoginEvents}>
        {showLoginEvents ? 'Hide Login Events' : 'Show Login Events'}
    </button>
    {showLoginEvents && (
        <section className="login-events">
            <h2>Driver Login Activity</h2>
            <table>
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Login Time</th>
                    </tr>
                </thead>
                <tbody>
                    {loginEvents.map((event, index) => (
                        <tr key={index}>
                            <td>{event.UserName}</td>
                            <td>{new Date(event.LoginTime).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )}
</div>
    <table>
            {/* Table headers and rows */}
            <thead>
                <tr>
                    <th>De-Activate User</th>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
            {users
                .filter(user => userRole !== 'Sponsor' || user.Role !== 'Admin') // Exclude admins if current user is a sponsor
                .map(user => (
    <tr key={user.UserId}>
        <td><button onClick={() => handleDeactivate(user.UserName)}>De-Activate</button></td>
        <td>{user.UserName}</td>
        <td>{user.FirstName}</td>
        <td>{user.LastName}</td>
        <td>{user.Email}</td>
        <td>{user.Role}</td>
    </tr>
))}
</tbody>

    </table>
</div>
);
};

export default UserManagement;
