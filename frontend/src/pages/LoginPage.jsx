import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../supabaseClient';

import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    let userId = null;

    try {
      // --- STEP 1: Call YOUR backend API's signup endpoint ---
      const signupResponse = await fetch('http://localhost:5000/users/', { // Use the confirmed path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }), 
      });

      const signupData = await signupResponse.json();

      // Check if the SIGNUP API call failed
      if (!signupResponse.ok) {
        // Use the error message from the signup API
        throw new Error(signupData.message || signupData.error || 'Sign-up failed. Please try again.'); 
      }

      userId = signupData.id;
      const profileUpdateUrl = `http://localhost:5000/profile/${userId}`;

      const setUsernameResponse = await fetch(profileUpdateUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }), 
      });

      if (!setUsernameResponse.ok) {
        throw new Error('Failed to set username after sign-up.');
      }
      
      // --- STEP 2: Sign up was successful, now immediately LOGIN ---
      // Call YOUR backend API's login endpoint using the same credentials
      const loginResponse = await fetch('http://localhost:5000/auth/login', { // Use the confirmed login path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Send email and password again
      });

      const loginData = await loginResponse.json();

      // Check if the LOGIN API call failed
      if (!loginResponse.ok) {
        // It's weird if signup worked but login failed, but handle it
        throw new Error(loginData.message || loginData.error || 'Account created, but auto-login failed.');
      }

      // Check if the LOGIN API returned the session data
      if (!loginData.session) {
         throw new Error("Account created, but session data missing from login response.");
      }

      // 3. SUCCESS! Tell the frontend Supabase client about the session from the LOGIN call.
      const { error: sessionError } = await supabase.auth.setSession(loginData.session);
      if (sessionError) {
          console.error("Error setting frontend session after signup/login:", sessionError);
          throw new Error("Account created, but failed to update local session.");
      }

      // 4. Navigate to the dashboard
      navigate('/dashboard');

    } catch (error) {
      setError(error.message); 
    } finally {
      setLoading(false); 
    }
  };

  const handleLogin = async (e) => {
    // Prevent the default form submission (page refresh)
    e.preventDefault(); 
    
    // Set loading state (optional, but good for UX)
    setLoading(true); 
    // Clear any previous errors
    setError(null); 

    try {
      // 1. Make the API call using fetch
      const response = await fetch('http://localhost:5000/auth/login', { // The path to your backend endpoint
        method: 'POST', // Use the POST method
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON
        },
        // Convert the email and password from state into a JSON string
        body: JSON.stringify({ 
          email: email,       // Get email from component state
          password: password  // Get password from component state
        }), 
      });

      // 2. Parse the JSON response from the server
      const data = await response.json();

      // 3. Check if the API reported an error (e.g., status 401 Unauthorized)
      if (!response.ok) {
        // If the server sent an error message, use it, otherwise use a default
        throw new Error(data.message || data.error || 'Login failed. Check your credentials.'); 
      }

      // 4. Check if the session data we need is in the response
      if (!data.session) {
         throw new Error("Login successful, but session data missing from API response.");
      }

      // 5. SUCCESS! Tell the frontend Supabase client about the session.
      // This makes `supabase.auth.getUser()` work correctly on the frontend.
      const { error: sessionError } = await supabase.auth.setSession(data.session);
      if (sessionError) {
          console.error("Error setting frontend session:", sessionError);
          // Don't throw here, maybe just warn the user, as login *did* succeed on backend
          setError("Login successful, but failed to update local session state.");
          // Still navigate, or decide how to handle this state inconsistency
      }

      // 6. Navigate the user to the main application page
      navigate('/dashboard');

    } catch (err) {
      // If any part of the try block failed, catch the error
      console.error("Login Error:", err);
      setError(err.message); // Display the error message on the page
    } finally {
      // This runs whether the login succeeded or failed
      setLoading(false); // Turn off the loading indicator
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{isSignUpMode ? 'Create Account' : 'Habit Fortress'}</h1>
      {isSignUpMode && (
        <input
          type="text"
          placeholder="Username (3-20 characters)"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      )}

      <input 
        type="email" 
        placeholder="Email" 
        className={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />
      <input 
        type="password" 
        placeholder="Password" 
        className={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className={styles.error}>{error}</p>}
      
      {isSignUpMode ? (
        <button className={styles.button} onClick={handleSignUp}disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      ) : (
        <button className={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
      )}
      <a 
        href="#" 
          className={styles.toggleLink} 
          onClick={(e) => {
            e.preventDefault();
            setIsSignUpMode(!isSignUpMode);
            setError(null);
          }}
        >
          {isSignUpMode ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </a>
    </div>
  )
}
