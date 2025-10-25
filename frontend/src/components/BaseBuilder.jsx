import React, { useRef, useEffect, useState } from 'react';
import { GameRenderer } from '../game/GameRenderer'; 

const BaseBuilder = () => {
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
          handleGameReady
      );
    }
    
    // Cleanup function: relies on the defensive destroy method in GameRenderer.js
    return () => {
      if (rendererRef.current) {
        rendererRef.current.destroy();
      }
    };
  }, []); 

  // --- Dedicated Effect to Place Initial Building (Runs when isGameReady is true) ---
  useEffect(() => {
      // This runs only after the engine signals it's safe to draw.
      if (isGameReady && rendererRef.current) {
        // Place one building to confirm the canvas is drawing
        rendererRef.current.placeBuilding(4, 4, 0x00FF00); 
      }
  }, [isGameReady]); 


  return (
    <div style={{ padding: '20px', backgroundColor: 'blue', textAlign: 'center'}}>
      <h1 style = {{color: 'black'}}>Your Fortress {isGameReady ? '':' Map loading'}</h1>
      
      {/* 🗺️ The Canvas: The Game View */}
      <div style={{ margin: '20px auto', border: '1px solid black', width: window.innerWidth, height: window.innerHeight }}>
        <canvas ref={canvasRef} width="800" height="600" />
      </div>
    </div>
  );
};

export default BaseBuilder;