/**
 * Label anchor positions (% of the wing screen in RoomWingVideoMenu; video is STRETCH-filled).
 */
export type WingLabelSlot = { topPct: number; leftPct: number };

/** Lower / force wing — 8 portals, row of 4 + row of 4 (matches typical Kling layout). */
export const LOWER_WING_LABEL_LAYOUT: Record<string, WingLabelSlot> = {
    shame: { topPct: 16, leftPct: 14 },
    guilt: { topPct: 16, leftPct: 38 },
    apathy: { topPct: 16, leftPct: 62 },
    grief: { topPct: 16, leftPct: 86 },
    fear: { topPct: 30, leftPct: 14 },
    desire: { topPct: 30, leftPct: 38 },
    anger: { topPct: 30, leftPct: 62 },
    pride: { topPct: 30, leftPct: 86 },
};

/** Higher / power wing — 9 portals, 3x3 grid in upper area. */
export const HIGHER_WING_LABEL_LAYOUT: Record<string, WingLabelSlot> = {
    courage: { topPct: 14, leftPct: 20 },
    neutrality: { topPct: 14, leftPct: 50 },
    willingness: { topPct: 14, leftPct: 80 },
    acceptance: { topPct: 24, leftPct: 20 },
    reason: { topPct: 24, leftPct: 50 },
    love: { topPct: 24, leftPct: 80 },
    joy: { topPct: 34, leftPct: 20 },
    peace: { topPct: 34, leftPct: 50 },
    enlightenment: { topPct: 34, leftPct: 80 },
};
