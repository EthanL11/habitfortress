// src/components/SettingsIcon.jsx
import React, { useState } from 'react';
import Settings from './Settings';
import gearcog from '/src/assets/gearcoh.png';
import styles from './SettingsIcon.module.css';

// --- 👇 ACCEPT THE NEW PROPS HERE ---
export default function SettingsIcon({
    currentZoom, setZoom,
    profile, onUpdateUsername, onDeleteAccount,
    onLogout // <-- Accept it here
})  {
    const [isPanelVisible, setIsPanelVisible] = useState(false);

    const togglePanel = () => {
        setIsPanelVisible(prev => !prev);
    };

    return (
        <div className={styles.settingsIconContainer}>
            <button
                className={styles.iconButton}
                onClick={togglePanel}
                style={{ backgroundImage: `url(${gearcog})` }}
                aria-expanded={isPanelVisible}
                aria-controls="zoom-settings-panel"
                aria-label="Open settings"
            />
            {isPanelVisible && (
                <div
                    id="zoom-settings-panel"
                    className={styles.settingsPanel}
                >
                    {/* --- 👇 PASS THE PROPS DOWN TO SETTINGS HERE --- */}
                    <Settings
                        currentZoom={currentZoom}
                        setZoom={setZoom}
                        profile={profile} // <-- Pass profile
                        onUpdateUsername={onUpdateUsername} // <-- Pass update function
                        onDeleteAccount={onDeleteAccount} // <-- Pass delete function\
                        onLogout={onLogout}
                    />
                </div>
            )}
        </div>
    );
}