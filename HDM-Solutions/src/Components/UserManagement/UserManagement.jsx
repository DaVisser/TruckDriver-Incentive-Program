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
    const [showProductsPurchases, setShowProductsPurchases] = useState(false); // State variable to control ProductsPurchases table visibility
    const [productsPurchases, setProductsPurchases] = useState([]); // State variable to hold ProductsPurchases data
    const [pointsToAdd, setPointsToAdd] = useState(0); // State variable to hold the points to add
    const [showAddPointsModal, setShowAddPointsModal] = useState(false); // State variable to control the visibility of the modal
    const [modifyUserUserName, setModifyUserUserName] = useState('');
    const [modifyUserIdentifier, setmodifyUserIdentifier] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(7);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Function to handle the addition of points to a user
    const handleAddPoints = async (identifier, pointsToAdd) => {
        try {
            const response = await fetch('https://p89w8l3slg.execute-api.us-east-1.amazonaws.com/dev/team06-ModifyPoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, pointsToAdd }),
            });

            if (!response.ok) {
                throw new Error('Failed to add points to user');
            }else{
                alert('Added Points Successfully!.');
            }
            setShowAddPointsModal(false);
        } catch (error) {
            console.error('Error adding points to user:', error);
            alert('Failed to add points.');
            // Handle error
        }
    };

    // Function to open the modal and set the user ID
    const openAddPointsModal = (modifyUsername,Identifier) => {
        setShowAddPointsModal(true);
        setModifyUserUserName(modifyUsername);
        setmodifyUserIdentifier(Identifier);
        console.log("IDENTIFIER:" , Identifier);
    };

    // Function to close the modal
    const closeAddPointsModal = () => {
        setShowAddPointsModal(false);
        // Optionally, you can reset the user ID here
    };


    const toggleProductsPurchases = async () => {
        setShowProductsPurchases(!showProductsPurchases); // Toggle table visibility
        if (!showProductsPurchases) {
            // Fetch ProductsPurchases data if not already fetched
            try {
                
                const response = await fetch(`https://sprfdiw4uc.execute-api.us-east-1.amazonaws.com/dev/team06-GrabPurchasedProducts`);
                const data = await response.json();
                const sortedData = data.sort((a, b) => a.ID - b.ID);
                setProductsPurchases(data);
            } catch (error) {
                console.error('Error fetching ProductsPurchases data:', error);
                // Handle error
            }
        }
    };


    // write a lambda function that disables a user in cognito
    const handleDeactivate = async (username) => {
        const confirmDeactivate = window.confirm(`Are you sure you want to deactivate ${username}?`);
        if (!confirmDeactivate) return;
    
        try {
            const response = await fetch('https://7ckucn4b35.execute-api.us-east-1.amazonaws.com/dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username, // Assuming your Lambda function expects a 'username' field in the body
                    userPoolId: 'us-east-1_2qaCHCZk4' // Include the UserPoolId if necessary, or handle it within the Lambda
                })
            });
    
            if (!response.ok) throw new Error('Failed to deactivate user');
            
            const result = await response.json();
            alert(result.message);
    
            // Refresh the users list by removing the deactivated user
            setUsers(users.filter(user => user.UserName !== username));
        } catch (error) {
            console.error("Error deactivating user: ", error);
            alert(`Failed to deactivate ${username}`);
        }
    };    
    // in progress ***********
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            // Ensure the userPoolId is correctly included
            const userDataWithPoolId = {
                ...newUserData,
                userPoolId: 'us-east-1_2qaCHCZk4', // Confirm this is the correct User Pool ID
            };
    
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
// in progress ***********
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
          console.log('UserRole: ', data.role);
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
            const response = await fetch('https://knwizrbtec.execute-api.us-east-1.amazonaws.com/dev/team06-loginRetrievalLogs');
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
                    // Filter out users without a Username or an Identifier
                    const filteredUsers = data.filter(user => user.Username !== '' && user.Identifier !== null);
                    console.log('Filtered: ', filteredUsers);
                    setUsers(filteredUsers);
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
            {showAddPointsModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeAddPointsModal}>&times;</span>
                        <h2>Add Points</h2>
                        <input
                            type="number"
                            value={pointsToAdd}
                            onChange={(e) => setPointsToAdd(parseInt(e.target.value))}
                            min={0}
                            max={10}
                        />
                        <button onClick={() => handleAddPoints(modifyUserIdentifier, pointsToAdd)}>Add Points</button>
                    </div>
                </div>
            )}
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
                {/* Toggle button for ProductsPurchases table */}
                {userRole === 'Admin' && (
                    <button onClick={toggleProductsPurchases}>
                        {showProductsPurchases ? 'Hide Products Purchases' : 'Show Products Purchases'}
                    </button>
                )}
                {/* ProductsPurchases table */}
                {showProductsPurchases && (
                    <section className="login-events">
                        <h2>Products Purchases</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Username</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            {productsPurchases.map((purchase, index) => (
                                <tr key={index}>
                                    <td>{purchase.ID}</td>
                                    <td>{purchase.ProductName}</td>
                                    <td>{purchase.Price}</td>
                                    <td>{purchase.Username}</td>
                                    <td>{new Date(purchase.Date).toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </div>

    <div>
        <button onClick={toggleLoginEvents}>
            {showLoginEvents ? 'Hide Login Events' : 'Show Login Events'}
        </button>
        {showLoginEvents && (
        <section className="login-events">
            <h2>User Login Activity</h2>
            <table>
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Login Time</th>
                        <th>Login Success</th> {/* Add a new table header for Login Success */}
                    </tr>
                </thead>
                <tbody>
                    {loginEvents.map((event, index) => (
                        <tr key={index}>
                            <td>{event.UserName}</td>
                            <td>{new Date(event.LoginTime).toLocaleString()}</td>
                            <td>{event.LoginSuccess === 1 ? 'Success' : 'Failure'}</td> {/* Display login success status */}
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
                        <th>Add Points</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through currentUsers instead of users */}
                    {currentUsers.map((user) => (
                        <tr key={user.UserId}>
                            <td><button onClick={() => handleDeactivate(user.UserName)}>De-Activate</button></td>
                            <td>{user.UserName}</td>
                            <td>{user.FirstName}</td>
                            <td>{user.LastName}</td>
                            <td>{user.Email}</td>
                            <td>{user.Role}</td>
                            <td><button onClick={() => openAddPointsModal(user.UserName,user.Identifier)}>Add Points</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination buttons */}
            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)}>{index + 1}</button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(users.length / usersPerPage)}>Next</button>
            </div>
</div>
    );
};

export default UserManagement;
