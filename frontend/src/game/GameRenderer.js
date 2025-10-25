import * as PIXI from 'pixi.js';
import { initialMapLayout } from './MapData.js'; 


//TO DO WHEN ZOOM IS 1 LOCK COORDS
export class GameRenderer {
  
  constructor(canvasElement, onTick, onReady,initalZoom) {
    this.app = new PIXI.Application();
    this.onTick = onTick;
    this.buildings = [];
    
    this.mapContainer = new PIXI.Container();
    this.isDragging = false;
    this.lastPosition = { x: 0, y: 0 };
    
    // Textures are now loaded directly as PIXI.Texture objects
    this.grassTexture = null; 
    this.pathTexture = null; 
    
    (async () => {
        await this.app.init({
            canvas: canvasElement,
            width: 1000,
            height: 780,
            backgroundColor: 'black', 
            antialias: true,
        });

        // --- Core Setup Sequence ---
        
        // 💥 FIX: Load the individual PNG files directly
        this.grassTexture = await PIXI.Assets.load("/src/assets/grass1.png"); 
        this.pathTexture = await PIXI.Assets.load("/src/assets/path1.png"); 
        
        // Removed: setupTextures() is no longer necessary
        this.gridSetup();
        
        // 1. Add the scrollable map container to the stage
        this.app.stage.addChild(this.mapContainer); 
        this.app.stage.interactive = true; 
        
        // 2. Apply the zoom scale to the map container
        this.mapContainer.scale.set(initalZoom);
        
        // 3. Set up mouse event handlers
        this.setupCameraControls();
        
        // 4. Start the game loop
        this.app.ticker.add(this.update.bind(this)); 
        
        if (onReady) {
            onReady();
        }

    })();
  }
  
  setZoom(scale) {
    if (this.mapContainer) {
        this.mapContainer.scale.set(scale); 
    }
  }
  // NOTE: setupTextures() has been deleted

  // --- Grid Creation ---
  gridSetup(){
    const gridSize = 50; 
    const baseContainer = new PIXI.Container();
    
    const mapHeight = initialMapLayout.length;
    const mapWidth = initialMapLayout[0].length; 

    for(let y = 0; y < mapHeight; y++){ 
        for(let x = 0; x < mapWidth; x++){
            const tileValue = initialMapLayout[y][x]; 
            let textureToUse;
            
            // Choose texture based on the value (0 for grass, 1 for path)
            if (tileValue === 1) {
                textureToUse = this.pathTexture;
            } else {
                textureToUse = this.grassTexture;
            }
            
            // PIXI.Sprite constructor automatically handles the PIXI.Texture object
            const tile = new PIXI.Sprite(textureToUse);
            
            tile.width = gridSize
            tile.height = gridSize
            tile.x = x * gridSize;
            tile.y = y * gridSize;
            
            baseContainer.addChild(tile); 
        }
    }
    this.mapContainer.addChild(baseContainer);
  }

  // --- Camera Control Methods ---
  setupCameraControls() {
    this.isDragging = false;
    this.lastPosition = { x: 0, y: 0 };

    this.app.stage.on('mousedown', this.onDragStart.bind(this));
    this.app.stage.on('mouseup', this.onDragEnd.bind(this));
    this.app.stage.on('mousemove', this.onDragMove.bind(this));
    this.app.stage.on('touchstart', this.onDragStart.bind(this));
    this.app.stage.on('touchend', this.onDragEnd.bind(this));
    this.app.stage.on('touchmove', this.onDragMove.bind(this));
  }

  onDragStart(event) {
    this.isDragging = true;
    this.lastPosition.x = event.global.x;
    this.lastPosition.y = event.global.y;
  }

  onDragEnd(event) {
    this.isDragging = false;
  }

  onDragMove(event) {
    const currentScale = this.mapContainer.scale.x; 

    // FIX 6: If you only want dragging at zoom 2x or 3x, check the current scale
    if (currentScale <= 1.0) { // e.g., if zoom is 1x, don't allow dragging
        return false;
    }
    if (this.isDragging) {
        const newPosition = event.global;
        
        const deltaX = newPosition.x - this.lastPosition.x;
        const deltaY = newPosition.y - this.lastPosition.y;

        this.mapContainer.x += deltaX;
        this.mapContainer.y += deltaY;

        this.lastPosition.x = newPosition.x;
        this.lastPosition.y = newPosition.y;
    }
  }

  // --- Utility Methods ---
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
    this.mapContainer.addChild(building); 
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