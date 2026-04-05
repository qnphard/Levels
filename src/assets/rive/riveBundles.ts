/**
 * Keep `require()` for .riv files in this folder (same directory as the binaries)
 * so Metro resolves them reliably on all platforms.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
export const ROOM_ATRIUM_RIV = require('./room_atrium.riv');
// eslint-disable-next-line @typescript-eslint/no-require-imports
export const ROOM_WING_RIV = require('./room_wing.riv');
