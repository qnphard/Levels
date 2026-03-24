/**
 * Label anchor positions (% of the wing stage in RoomWingVideoMenu).
 * Video fills the stage (iOS: STRETCH; Android: CONTAIN + scaleX after naturalSize). Tune if a clip changes.
 */
export type WingLabelSlot = { topPct: number; leftPct: number };

/**
 * Lower / force wing — same % anchors as power wing (portal slot order: top L→R, bottom L→R).
 * shame…grief ↔ courage…joy; fear…pride ↔ neutrality…peace.
 */
export const LOWER_WING_LABEL_LAYOUT: Record<string, WingLabelSlot> = {
    shame: { topPct: 31.3, leftPct: 8.2 },
    guilt: { topPct: 55.3, leftPct: 21.1 },
    apathy: { topPct: 31.3, leftPct: 32.8 },
    grief: { topPct: 55.3, leftPct: 45.5 },
    fear: { topPct: 31.3, leftPct: 56.5 },
    desire: { topPct: 55.3, leftPct: 69 },
    anger: { topPct: 31.3, leftPct: 79 },
    pride: { topPct: 55.3, leftPct: 92 },
};

/**
 * Lower / force wing label colors: sampled from `levels-of-force-room.mp4` (8 columns, vivid glow pixels).
 * Regenerate: `ffmpeg -y -i assets/videos/levels-of-force-room.mp4 -ss 00:00:01 -vframes 1 scripts/_force.png`
 * then `node scripts/sample-portal-colors.cjs scripts/_force.png force`.
 */
export const LOWER_WING_PORTAL_PILL_COLORS: Record<string, string> = {
    shame: '#9b2208',
    guilt: '#dd602d',
    apathy: '#5c5a6f',
    grief: '#6c49a2',
    fear: '#3b6b78',
    desire: '#b84312',
    anger: '#ff8f1a',
    pride: '#ca4f60',
};

/**
 * Higher / power wing: sampled from `power-levels-room.mp4`.
 * Regenerate: `ffmpeg -y -i assets/videos/power-levels-room.mp4 -ss 00:00:01 -vframes 1 scripts/_frame.png`
 * then `node scripts/sample-portal-colors.cjs scripts/_frame.png`.
 */
export const HIGHER_WING_PORTAL_PILL_COLORS: Record<string, string> = {
    courage: '#aaf444',
    willingness: '#45a7f5',
    reason: '#2d84f2',
    joy: '#fb57af',
    neutrality: '#cb71f5',
    acceptance: '#bd69e4',
    love: '#f74442',
    peace: '#fcdb38',
};

/**
 * Higher / power wing — 8 portals in an arc (`power-levels-room.mp4`).
 * Order matches ROOM_HIGHER_LEVELS. Tuned on device (two rows of four).
 */
export const HIGHER_WING_LABEL_LAYOUT: Record<string, WingLabelSlot> = {
    courage: { topPct: 31.3, leftPct: 8.2 },
    willingness: { topPct: 31.3, leftPct: 32.8 },
    reason: { topPct: 31.3, leftPct: 55.9 },
    joy: { topPct: 31.3, leftPct: 78.2 },
    neutrality: { topPct: 55.3, leftPct: 21.1 },
    acceptance: { topPct: 55.3, leftPct: 43.8 },
    love: { topPct: 55.3, leftPct: 67.5 },
    peace: { topPct: 55.3, leftPct: 91 },
};
