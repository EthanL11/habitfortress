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

    try{
      const response = await fetch('../../api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error signing up');
      }

      if(!result.session) {
        throw new Error("Signup successful, but session data missing from API response.");
      }
      const { error: sessionError } = await supabase.auth.setSession(result.session);
      if (sessionError) {
        console.error("Error setting frontend session:", sessionError);
        throw new Error("Signup successful, but failed to update local session.");
      }

      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;

      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
