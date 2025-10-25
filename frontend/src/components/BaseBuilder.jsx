import React, { useRef, useEffect, useState } from 'react';
import { GameRenderer } from '../game/GameRenderer'; 

const BaseBuilder = ({currentZoom}) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const [isGameReady, setIsGameReady] = useState(false); 

  // Function called by GameRenderer when it finishes initialization (the signal)
  const handleGameReady = () => {
      setIsGameReady(true);
  };
  
  const dummyGameTick = () => {}; 

  // --- Canvas Setup Effect (Runs once on mount) ---
  useEffect(() => {
    if (canvasRef.current) {
      // Passes the canvas, dummy tick, and the readiness signal
      rendererRef.current = new GameRenderer(
          canvasRef.current, 
          dummyGameTick, 
          handleGameReady,
          currentZoom
      );
    }
    
    // Cleanup function: relies on the defensive destroy method in GameRenderer.js
    return () => {
      if (rendererRef.current) {
        rendererRef.current.destroy();
      }
    };
  }, []); 

  useEffect(() => {
      // This runs ONLY when currentZoom changes (after the component mounts)
      if (isGameReady && rendererRef.current) {
        rendererRef.current.setZoom(currentZoom); 
        console.log(`Zoom updated to: ${currentZoom}`); // Check console to confirm this fires
      }
  }, [currentZoom, isGameReady]); // Dependencies: updates when zoom changes or game readiness changes

  // --- Dedicated Effect to Place Initial Building (Runs when isGameReady is true) ---
  useEffect(() => {
      // This runs only after the engine signals it's safe to draw.
      if (isGameReady && rendererRef.current) {
        // Place one building to confirm the canvas is drawing
        rendererRef.current.placeBuilding(4, 4, 0x00FF00); 
      }
  }, [isGameReady]); 


  return (
    <div style={{ padding: '20px',backgroundColor: 'transparent', textAlign: 'center'}}>
    <h1 style ={{fontSize: '100px', color: 'white'}}>Habit Fortress</h1>
      <div style={{ margin: '20px auto', width: window.innerWidth, height: window.innerHeight }}>
        <canvas style = {{border: 'solid', borderWidth: '10px', borderColor: 'black'}}ref={canvasRef} width="1000" height="780" />
      </div>
    </div>
  );
};

export default BaseBuilder;