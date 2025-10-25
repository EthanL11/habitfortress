import * as PIXI from 'pixi.js';
import { initialMapLayout } from './MapData.js'; 

const TILE_ASSET_SIZE = 64; 

export class GameRenderer {
  
  constructor(canvasElement, onTick, onReady) {
    this.app = new PIXI.Application();
    this.onTick = onTick;
    this.buildings = [];
    
    // Textures are now PIXI.Texture objects loaded directly
    this.grassTexture = null; 
    this.pathTexture = null; 
    
    (async () => {
        await this.app.init({
            canvas: canvasElement,
            width: 1000, 
            height: 780, 
            backgroundColor: 0x4B6F4F, 
            antialias: true,
        });

        // 💥 NEW: Load the textures directly by file name
        this.grassTexture = await PIXI.Assets.load("/src/assets/grass1.png"); 
        this.pathTexture = await PIXI.Assets.load("/src/assets/path1.png"); 
        
        // 2. Setup the game map grid using the loaded textures
        this.gridSetup();
        
        // 3. Start the game loop
        this.app.ticker.add(this.update.bind(this)); 
        
        if (onReady) {
            onReady();
        }

    })();
  }
  
  // 💥 REMOVE the setupTextures() method entirely! It's no longer needed.

  gridSetup(){
    const gridSize = 50; 
    const baseContainer = new PIXI.Container();
    
    // Check for map data safety
    const mapHeight = initialMapLayout.length;
    const mapWidth = initialMapLayout[0].length; 

    // Iterate through the ROWS (Y-coordinate)
    for(let y = 0; y < mapHeight; y++){ 
        // Iterate through the COLUMNS (X-coordinate)
        for(let x = 0; x < mapWidth; x++){
            
            const tileValue = initialMapLayout[y][x]; 
            let textureToUse;
            
            // Choose texture based on the value (0 for grass, 1 for path)
            // Note: Your MapData.js file still uses 0 and 1, so we map them here.
            if (tileValue === 1) {
                textureToUse = this.pathTexture;
            } else {
                textureToUse = this.grassTexture;
            }
            
            const tile = new PIXI.Sprite(textureToUse);
            
            // Scale and position the tile
            tile.width = gridSize;
            tile.height = gridSize;
            tile.x = x * gridSize;
            tile.y = y * gridSize;
            
            baseContainer.addChild(tile); 
        }
    }
    
    this.app.stage.addChild(baseContainer);
  }

  // --- Core Methods ---
  update(delta) {
    this.onTick(); 
  }

  placeBuilding(x, y, color) {
    const buildingSize = 40;
    const gridSize = 50;
    
    const building = new PIXI.Graphics();
    building.fill({ color: color });
    building.rect(0, 0, buildingSize, buildingSize);
    
    building.x = (x * gridSize) + (gridSize - buildingSize) / 2;
    building.y = (y * gridSize) + (gridSize - buildingSize) / 2;
    
    this.buildings.push(building);
    this.app.stage.addChild(building);
  }

  destroy() {
    if (this.app && this.app.renderer) {
        if (this.app.ticker) {
            this.app.ticker.stop();
        }
        this.app.destroy(true, { children: true, texture: true, baseTexture: true });
    }
    this.app = null; 
  }
}