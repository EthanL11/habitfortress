// src/components/Settings.jsx
import React, { useState } from 'react';
import styles from './Settings.module.css'; // We'll update this CSS file

// NEW PROPS:
// - profile: Object containing { id, username }
// - onUpdateUsername: Function to call API to update username (takes newUsername)
// - onDeleteAccount: Function to call API to delete account
export default function Settings({ currentZoom, setZoom, profile, onUpdateUsername, onDeleteAccount, onLogout }) {
    
    // --- Zoom State & Handler ---
    const handleSliderChange = (event) => {
        const newValue = parseFloat(event.target.value); 
        setZoom(newValue);
    }
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 3;
    const STEP = 1; 

    // --- Username Editing State ---
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(profile?.username || ''); // Initialize with current username
    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState(null);

    // --- Handle Saving Username ---
    const handleSaveUsername = async () => {
        if (!newUsername.trim() || newUsername === profile?.username) {
            setIsEditingUsername(false); // Just close if no change or empty
            setEditError(null);
            return;
        }
        setIsSaving(true);
        setEditError(null);
        try {
            await onUpdateUsername(newUsername); // Call the function passed from DashboardPage
            setIsEditingUsername(false); // Close edit mode on success
        } catch (error) {
            setEditError(error.message || "Failed to update username.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Handle Account Deletion ---
    const handleDeleteClick = () => {
        // Confirmation is important!
        if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
             onDeleteAccount(); // Call the function passed from DashboardPage
             // DashboardPage should handle redirecting after deletion is confirmed by API
        }
    };


    return(
        <div className={styles.settingsContainer}>
            {/* --- User Info Section --- */}
            <div className={styles.userInfoSection}>
                <h3 className={styles.sectionTitle}>Account</h3>
                {editError && <p className={styles.errorText}>{editError}</p>}
                
                {isEditingUsername ? (
                    <div className={styles.editUsernameForm}>
                        <input 
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className={styles.usernameInput}
                            placeholder="Enter new username"
                            disabled={isSaving}
                        />
                        <button onClick={handleSaveUsername} disabled={isSaving || !newUsername.trim()} className={styles.saveButton}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => { setIsEditingUsername(false); setEditError(null); setNewUsername(profile?.username || ''); }} disabled={isSaving} className={styles.cancelButton}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className={styles.displayUsername}>
                        <p>Username: <strong>{profile?.username || 'Loading...'}</strong></p>
                        <button onClick={() => setIsEditingUsername(true)} className={styles.editButton}>Edit</button>
                    </div>
                )}
                <button onClick={onLogout} className={styles.logoutButton} disabled={isSaving}>
                    Logout
                </button>
                 <button onClick={handleDeleteClick} className={styles.deleteAccountButton} disabled={isSaving}>
                    Delete Account
                </button>
            </div>

            {/* --- Divider --- */}
            <hr className={styles.divider} /> 

            {/* --- Zoom Section --- */}
            <div className={styles.zoomSection}>
                <h3 className={styles.sectionTitle}>Zoom Scale</h3>
                <input 
                    type="range"
                    min={MIN_ZOOM}
                    max={MAX_ZOOM}
                    step={STEP}
                    value={currentZoom.toString()} 
                    onChange={handleSliderChange}
                    className={styles.zoomSlider} 
                />
                <p className={styles.currentValueText}>
                    Current Scale: {currentZoom.toFixed(1)}x
                </p>
            </div>
        </div>
    )
}