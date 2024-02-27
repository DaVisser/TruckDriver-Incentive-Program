import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import { Amplify } from "aws-amplify";
import awsExports from './aws-exports';
import './App.css'
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator, useAuthenticator, View, Button, Heading, TextField, useTheme, Image, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Login from './Components/CognitoSignup/logged_in.jsx';
import Logout from './Components/CognitoSignup/logged_out.jsx';
import Index from './Components/CognitoSignup/index.jsx';
import AboutPage from './Components/AboutPage/AboutPage.jsx';
import ProfilePage from './Components/ProfilePage/ProfilePage.jsx';
import ProductCatalog from './Components/ProductCatalog/ProductCatalog.jsx';
import hdmsolutionslogo from './Components/Assets/hdm-solutions-logo.jpg'

Amplify.configure(awsExports)

const components = {
    Header() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Image
            alt="HDM Solutions logo"
            src={hdmsolutionslogo}
            style={{ width: '200px', height: 'auto' }}
          />
        </View>
      );
    },
  
    Footer() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Text color={tokens.colors.neutral[80]}>
            &copy; All Rights Reserved
          </Text>
        </View>
      );
    },
  
    SignIn: {
      Header() {
        const { tokens } = useTheme();
  
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Sign in to your account
          </Heading>
        );
      },
      Footer() {
        const { toForgotPassword } = useAuthenticator();
  
        return (
          <View textAlign="center">
            <Button
              fontWeight="normal"
              onClick={toForgotPassword}
              size="small"
              variation="link"
            >
              Reset Password
            </Button>
          </View>
        );
      },
    },
  
    SignUp: {
      Header() {
        const { tokens } = useTheme();
  
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Create a new account
          </Heading>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
  
        return (
          <View textAlign="center">
            <Button
              fontWeight="normal"
              onClick={toSignIn}
              size="small"
              variation="link"
            >
              Back to Sign In
            </Button>
          </View>
        );
      },
    },
    ConfirmSignUp: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
    },
    SetupTotp: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
    },
    ConfirmSignIn: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
    },
    ForgotPassword: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Forgot Password:
          </Heading>
        );
      },
    },
    ConfirmResetPassword: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
    },
  };
  
  const formFields = {
    signIn: {
      username: {
        placeholder: 'Enter your email',
      },
    },
    signUp: {
        username: {
        placeholder: 'Enter your Username',
        isRequired: true,
        order: 1,
        },
      password: {
        label: 'Password:',
        placeholder: 'Enter your Password',
        isRequired: true,
        order: 2,
      },
      confirm_password: {
        label: 'Confirm Password:',
        isRequired: true,
        order: 3,
      },
      email: {
        label: 'Email:',
        placeholder: 'Enter your email',
        isRequired: true,
        order: 4,
      },
      birthdate: {
        label: 'Birthdate',
        placeholder: 'Enter your birthdate',
        isRequired: true,
      },
      phone_number: {
        label: 'Phone',
        placeholder: 'Enter your phone number',
        isRequired: true,
      },
      given_name: {
        label: 'First Name',
        placeholder: 'Enter your first name',
        isRequired: true,
      },
      family_name: {
        label: 'Last Name',
        placeholder: 'Enter your last name',
        isRequired: true,
      },
      gender: {
        label: 'Gender',
        placeholder: 'Male/Female',
        isRequired: true,
      },
      LicenseID: {
        label: 'LicenseID',
        placeholder: 'Enter your LicenseID',
        isRequired: true,
      },
      Role: {
        label: 'Role',
        placeholder: 'Driver/Sponsor',
        isRequired: true,
      },
    },
    forceNewPassword: {
      password: {
        placeholder: 'Enter your Password:',
      },
    },
    forgotPassword: {
      username: {
        placeholder: 'Enter your email:',
      },
    },
    confirmResetPassword: {
      confirmation_code: {
        placeholder: 'Enter your Confirmation Code:',
        label: 'New Label',
        isRequired: false,
      },
      confirm_password: {
        placeholder: 'Enter your Password Please:',
      },
    },
    setupTotp: {
      QR: {
        totpIssuer: 'test issuer',
        totpUsername: 'amplify_qr_test_user',
      },
      confirmation_code: {
        label: 'New Label',
        placeholder: 'Enter your Confirmation Code:',
        isRequired: false,
      },
    },
    confirmSignIn: {
      confirmation_code: {
        label: 'New Label',
        placeholder: 'Enter your Confirmation Code:',
        isRequired: false,
      },
    },
  };
  
export default function App() {
    return (
        <Authenticator formFields={formFields} components={components}>
            {({ signOut }) => (
                <Router>
                    <div>
                        <nav>
                            <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/profile">Profile</Link> | <Link to="/catalog">Catalog</Link>
                        </nav>
                        <Routes>
                            <Route path="/" element={<button onClick={signOut}>Sign out</button>} />
                            <Route path="/about" element={<AboutPage signOut={signOut} />} />
                            <Route path="/profile" element={<ProfilePage signOut={signOut} />} />
                            <Route path="/catalog" element={<ProductCatalog signOut={signOut} />} />
                        </Routes>
                    </div>
                </Router>
            )}
        </Authenticator>
    );
}