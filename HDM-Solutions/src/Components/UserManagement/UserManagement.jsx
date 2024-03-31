// src/Components/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import { getCurrentUser, fetchUserAttributes, updateUserAttributes, confirmUserAttribute, verifyCurrentUserAttributeSubmit} from 'aws-amplify/auth';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Assume loading by default
    const [isError, setIsError] = useState(false);

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
        if (userRole === 'Admin') {
            // Fetch users only if the userRole is 'Admin'
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
    }, [userRole]); // Depend on userRole

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error occurred while fetching user role.</div>;
    if (userRole !== 'Admin') return <div>You are not authorized to view this page.</div>;

    return (
        <div>
            <h1>User Management</h1>
            <table>
                {/* Table headers and rows */}
                <thead>
                    <tr>
                        <th>Delete User</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.UserId}>
                            <td><button>Delete</button></td>
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
