// src/components/Settings.jsx (REVISED to use HTML Range Input)

import React from 'react';
// NOTE: We are removing react-slick and using standard HTML input type="range"

export default function Settings({ currentZoom, setZoom }) {
    
    const handleSliderChange = (event) => {
        // Read the value and ensure it's a number (it will be 1, 2, or 3)
        const newValue = parseFloat(event.target.value); 
        
        setZoom(newValue);
    }

    // Define the range properties based on your exact requirement
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 3;
    const STEP = 1; // 💥 CRITICAL: This forces the slider to jump by 1 unit

    return(
        <div style={{ padding: '10px', width: '300px' }}>
            <h2>Zoom Scale</h2>
            
            {/* 🚀 HTML Range Input with Restricted Values */}
            <input 
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={STEP} // 💥 Only allows values 1, 2, or 3
                
                // Set value from state
                value={currentZoom.toString()} 
                onChange={handleSliderChange}
                style={{ width: '100%' }}
            />
            
            {/* Display the current scale */}
            <p style={{ marginTop: '5px' }}>Current Scale: {currentZoom.toFixed(1)}x</p>
        </div>
    )
}