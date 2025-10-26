// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import SettingsIcon from "../components/SettingsIcon";
import BaseInfo from "../components/BaseInfo";
import BaseBuilder from "../components/BaseBuilder";
import Header from "../components/Header";
import GoalList from "../components/GoalList";
import styles from "./DashboardPage.module.css";
import back from "../assets/stoneback.png"; // Assuming this path is correct

export default function DashboardPage() {
  const [zoomScale, setZoomScale] = useState(1.0); // Start at 1.0 maybe?
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null); // Will hold { id, username, points, ... }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetchProfile = async () => {
      setLoading(true); // Ensure loading is true at start
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('No user found, redirecting to login.');
        navigate('/');
        return;
      }

      // Fetch the FULL profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*') // Fetch everything
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        navigate('/'); // Redirect on profile error
      } else {
        setProfile(profileData);
      }
      setLoading(false);
    };
    checkUserAndFetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout:', error);
    } else {
      navigate('/');
    }
  };

  // --- 👇 ADDED: FUNCTION TO UPDATE USERNAME VIA API ---
  const handleUpdateUsername = async (newUsername) => {
    if (!profile) return Promise.reject(new Error("Profile not loaded.")); // Return a rejected promise

    // !!! CONFIRM API PATH AND AUTH REQUIREMENT !!!
    // Assuming PATCH /profile/:userId and Auth needed
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error("Authentication required.");
    }
    const token = session.access_token;

    try {
      const response = await fetch(`http://localhost:5000/profile/${profile.id}`, { // CONFIRM PATH
        method: 'PATCH', // Or PUT?
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ username: newUsername })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update username (Status: ${response.status})`);
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile); // Update local state immediately
      // Do NOT return here, let the promise resolve naturally
      
    } catch (error) {
      console.error("Error updating username:", error);
      throw error; // Re-throw so Settings component knows about the error
    }
  };

  // --- 👇 ADDED: FUNCTION TO DELETE ACCOUNT VIA API ---
  const handleDeleteAccount = async () => {
     // Ensure profile data (which contains the ID) is loaded
     if (!profile || !profile.id) {
        alert("Cannot delete account: User data not loaded.");
        return; 
     }

     // --- STEP 1: Confirm with the user ---
     // Use window.confirm for simplicity, but a custom modal is better UX
     if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
        
        try {
           // --- STEP 2: Get Authentication Token (ASSUMING IT'S NEEDED) ---
           // Ask your teammate if the DELETE /users/:id endpoint requires this header
           const { data: { session }, error: sessionError } = await supabase.auth.getSession();
           if (sessionError || !session) {
              // Handle error: Maybe alert the user or throw an error
              throw new Error("Authentication session is required to delete account.");
           }
           const token = session.access_token;

           // --- STEP 3: Construct the API URL ---
           // !!! CONFIRM THIS PATH with your teammate: Is it /users/ or /profile/ or something else? !!!
           const apiUrl = `http://localhost:5000/users/${profile.id}`; 

           // --- STEP 4: Make the DELETE request ---
           const response = await fetch(apiUrl, { 
               method: 'DELETE',
               headers: {
                   // Include the Authorization header (remove if teammate confirms it's not needed)
                   'Authorization': `Bearer ${token}` 
                   // No 'Content-Type' or 'body' is typically needed for DELETE with ID in URL
               }
           });

           // --- STEP 5: Check the response ---
           if (!response.ok) {
               // Try to get a specific error message from the backend
               let errorMsg = `Failed to delete account (Status: ${response.status})`;
               try {
                   const errorData = await response.json(); // Assumes backend sends JSON error
                   errorMsg = errorData.message || errorData.error || errorMsg;
               } catch(e) { /* Ignore if response wasn't JSON */ }
               throw new Error(errorMsg);
           }

           // --- STEP 6: Handle successful deletion ---
           console.log("Account deleted successfully via API."); // Log for debugging

           // Log the user out from the Supabase frontend session
           await supabase.auth.signOut(); 
           
           // Redirect the user to the login page
           navigate('/'); 
           
           // Optional: Show a success message
           alert("Your account has been deleted successfully."); 

        } catch (error) {
           // --- STEP 7: Handle errors ---
           console.error("Error deleting account:", error);
           // Show a user-friendly error message
           alert("Error deleting account: " + error.message); 
        }
        // No finally block needed here, action completes on success/error
     } else {
        // User clicked "Cancel" on the confirmation dialog
        console.log("Account deletion cancelled by user.");
     }
  };

  


  if (loading) {
    return <div className={styles.container}>Loading...</div>; // Consider a styled loading screen
  }
  if (!profile) {
     return <div className={styles.container}>Error loading profile data. Please try logging in again.</div>;
  }

  return (
    // Set background image on the main wrapper div
    <div className={styles.pageWrapper} style={{ backgroundImage:`url(${back})` }}>

      {/* --- Settings Icon Area --- */}
      {/* Positioned absolutely via CSS module */}
      <div className={styles.settingsArea}>
        <SettingsIcon
          currentZoom={zoomScale}
          setZoom={setZoomScale}
          // --- 👇 PASS DOWN PROFILE AND HANDLERS ---
          profile={profile}
          onUpdateUsername={handleUpdateUsername}
          onDeleteAccount={handleDeleteAccount}
          onLogout={handleLogout}
        />
      </div>

      {/* --- Main Content Area --- */}
      <div className={styles.mainContent}>
        {/* Header Area */}
        <div className={styles.headerArea}>
           <Header
             // --- 👇 CORRECT PROP NAME ---
             username={profile.username} // Pass only the username string
           />
        </div>
        
        {/* Base Info Area (Positioned via CSS) */}
        <div className={styles.baseInfoArea}>
            <BaseInfo />
        </div>

        {/* Base Builder Area */}
        <div className={styles.baseBuilderArea}>
            <BaseBuilder currentZoom={zoomScale} />
        </div>
      </div>

      {/* --- Goals List Area --- */}
      <div className={styles.goalListContainer}>
        <h2>Your Goals</h2>
        <GoalList />
      </div>

    </div>
  );
}