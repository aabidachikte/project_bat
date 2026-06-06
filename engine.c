#include <emscripten.h>

// We define fixed dimensions. C prefers fixed boundaries because 
// dynamically resizing arrays at runtime takes extra CPU cycles.
#define MAP_WIDTH 20
#define MAP_HEIGHT 20

// 1 represents a wall, 0 represents walkable floor space.
// This forms the core physical boundary of our underground facility.
int map[MAP_WIDTH][MAP_HEIGHT] = {
    {1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1},
    {1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1},
    {1,0,1,1,0,0,1,0,1,1,1,1,1,1,0,1,1,1,0,1},
    {1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1},
    {1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0,1,1,1},
    {1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,1},
    {1,0,1,1,1,1,0,0,1,0,1,0,1,1,0,1,1,1,0,1},
    {1,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,1},
    {1,0,1,0,0,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1},
    {1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1},
    {1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1}
};

// This macro tells the Emscripten compiler: "Don't optimize away this function.
// Keep it alive so JavaScript can call it directly across the Wasm bridge."
EMSCRIPTEN_KEEPALIVE
int get_map_tile(int x, int y) {
    // Basic bounds checking. If JS requests a tile outside the grid,
    // we return a wall (1) to prevent memory access faults.
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
        return 1; 
    }
    return map[x][y];
}
