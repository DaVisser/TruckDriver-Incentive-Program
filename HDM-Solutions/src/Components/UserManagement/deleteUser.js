const { 
    CognitoIdentityProviderClient,
    AdminDeleteUserCommand,
  } = require("@aws-sdk/client-cognito-identity-provider");
  
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' }); // Example region
  
  async function deleteUser(username) {
    const adminDeleteUserCommandInput = {
        UserPoolId: 'us-east-1_2qaCHCZk4', // Your UserPoolId here
        Username: username
    };
  
    try {
      const adminDeleteUserCommandResults = await client.send(new AdminDeleteUserCommand(adminDeleteUserCommandInput));
      console.log("User deleted successfully", adminDeleteUserCommandResults);
      return adminDeleteUserCommandResults; // For further processing or confirmation
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error; // Rethrow or handle as needed
    }
  }
  
  export default deleteUser;
  