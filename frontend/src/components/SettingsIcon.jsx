import React, { useState } from 'react';
import Settings from './Settings'; // Assuming your slider is here
import gearcog from '/src/assets/gearcoh.png'

// Placeholder for a simple cog icon character

export default function SettingsIcon({ currentZoom, setZoom }) {
    // 💥 State to manage whether the slider panel is visible
    const [isPanelVisible, setIsPanelVisible] = useState(false);

    // Function to toggle the visibility state
    const togglePanel = () => {
        setIsPanelVisible(prev => !prev);
    };

    return (
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
            
            {/* 1. The Cog Icon Button */}
            <button
            
                onClick={togglePanel} 
                style={{ 
                    backgroundImage: `url(${gearcog})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '40x',
                    height: '40px',
                    backgroundColor: 'transparent'

                    
                    
                }}
                aria-expanded={isPanelVisible}
                aria-controls="zoom-settings-panel"
            >
            </button>

            {/* 2. The Slider Panel (Conditionally Rendered) */}
            {/* 💥 Only render the Settings component if isPanelVisible is TRUE */}
            {isPanelVisible && (
                <div 
                    id="zoom-settings-panel" 
                    style={{ 
                        position: 'absolute', 
                        right: '0', 
                        padding: '10px',
                        background: '#333',
                        border: '1px solid #555',
                        borderRadius: '5px',
                        width: '320px'
                    }}
                >
                    <Settings currentZoom={currentZoom} setZoom={setZoom} />
                </div>
            )}
        </div>
    );
}