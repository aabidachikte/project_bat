// 1. SELECT THE CANVAS & SET UP RENDERING CONTEXT
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// To match our 20x20 C engine grid inside a 600x600 canvas space,
// each tile must occupy exactly 30 pixels (30 * 20 = 600).
const TILE_SIZE = 30;

// Local tracking state for the player avatar
let player = { x: 1, y: 1 }; 

/**
 * 2. THE WEBASSEMBLY LIFECYCLE HOOK
 * Emscripten creates a global 'Module' object. When the runtime and memory 
 * space are completely loaded and compiled in the browser, it calls 'onRuntimeInitialized'.
 */
Module.onRuntimeInitialized = () => {
    console.log("► PROJECT_BAT CORE ENGINE: INITIALIZED");
    
    // Listen for physical keyboard strokes
    window.addEventListener("keydown", handleInput);
    
    // Start our high-frame-rate rendering engine loop
    renderLoop();
};

/**
 * 3. BASIC PLAYER MOVEMENT CONTROLLER
 */
function handleInput(event) {
    let targetX = player.x;
    let targetY = player.y;

    if (event.key === "ArrowUp")    targetY--;
    if (event.key === "ArrowDown")  targetY++;
    if (event.key === "ArrowLeft")  targetX--;
    if (event.key === "ArrowRight") targetX++;

    /**
     * THE CROSS-BRIDGE CHECK:
     * Before moving the player, we call the compiled C function '_get_map_tile'.
     * Emscripten prefixes all exported C functions with an underscore (_).
     * If C tells us the space is empty (0), we allow the movement.
     */
    if (Module._get_map_tile(targetX, targetY) === 0) {
        player.x = targetX;
        player.y = targetY;
        console.log(`Player moved to C-Memory Coordinate: (${player.x}, ${player.y})`);
    } else {
        console.log("Movement blocked: Collision detected by C Engine.");
    }
}

/**
 * 4. THE GRAPHICS RENDERING LOOP
 * Runs at roughly 60 frames per second using the browser's hardware acceleration.
 */
function renderLoop() {
    // Clear the screen with deep black on every frame update
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // TEMPORARY: Draw player as a neon magenta square so we can verify tracking works.
    // We will replace this later with the sonar-reveal matrix.
    ctx.fillStyle = "#ff007f"; 
    ctx.fillRect(player.x * TILE_SIZE + 4, player.y * TILE_SIZE + 4, TILE_SIZE - 8, TILE_SIZE - 8);

    // Keep the cycle running indefinitely
    requestAnimationFrame(renderLoop);
}
