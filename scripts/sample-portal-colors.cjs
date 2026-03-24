/**
 * Sample vivid (high-chroma) RGB from 8 horizontal slots — for `power-levels-room.mp4` frames, not emulator crops
 * (those often average to dark bezel gray).
 *
 * 1) ffmpeg -y -i assets/videos/power-levels-room.mp4 -ss 00:00:01 -vframes 1 scripts/_frame.png
 * 2) node scripts/sample-portal-colors.cjs scripts/_frame.png [higher|force]
 *    `force` uses shame…pride (levels-of-force-room.mp4); default ids are courage…peace.
 */
const sharp = require('sharp');

const IDS_HIGHER = [
    'courage',
    'willingness',
    'reason',
    'joy',
    'neutrality',
    'acceptance',
    'love',
    'peace',
];
const IDS_FORCE = ['shame', 'guilt', 'apathy', 'grief', 'fear', 'desire', 'anger', 'pride'];

async function main() {
    const imagePath = process.argv[2];
    const mode = (process.argv[3] || 'higher').toLowerCase();
    if (!imagePath) {
        console.error('Usage: node scripts/sample-portal-colors.cjs <frame.png> [higher|force]');
        process.exit(1);
    }
    const meta = await sharp(imagePath).metadata();
    const w = meta.width;
    const h = meta.height;
    if (!w || !h) throw new Error('Could not read image dimensions');

    const y0 = Math.floor(h * 0.36);
    const y1 = Math.floor(h * 0.68);
    const bandH = Math.max(1, y1 - y0);
    const slotW = w / 8;
    const ids = mode === 'force' || mode === 'lower' ? IDS_FORCE : IDS_HIGHER;

    function vibrantAvg(buf, channels) {
        const pix = [];
        for (let p = 0; p < buf.length; p += channels) {
            const r = buf[p];
            const g = buf[p + 1];
            const b = buf[p + 2];
            const mx = Math.max(r, g, b);
            const mn = Math.min(r, g, b);
            const chroma = mx - mn;
            if (mx < 55 || chroma < 28) continue;
            pix.push({ r, g, b, score: chroma * (mx / 255) });
        }
        if (pix.length < 8) {
            pix.length = 0;
            for (let p = 0; p < buf.length; p += channels) {
                const r = buf[p];
                const g = buf[p + 1];
                const b = buf[p + 2];
                const mx = Math.max(r, g, b);
                const mn = Math.min(r, g, b);
                pix.push({ r, g, b, score: (mx - mn) * (mx / 255) });
            }
        }
        pix.sort((a, b) => b.score - a.score);
        const take = Math.max(12, Math.floor(pix.length * 0.12));
        let r = 0;
        let g = 0;
        let b = 0;
        for (let j = 0; j < take; j++) {
            r += pix[j].r;
            g += pix[j].g;
            b += pix[j].b;
        }
        r = Math.round(r / take);
        g = Math.round(g / take);
        b = Math.round(b / take);
        return { r, g, b, picked: take };
    }

    const out = [];
    for (let i = 0; i < 8; i++) {
        const cx = (i + 0.5) * slotW;
        const half = slotW * 0.28;
        const left = Math.max(0, Math.floor(cx - half));
        const width = Math.min(Math.ceil(half * 2), w - left);

        const { data, info } = await sharp(imagePath)
            .extract({ left, top: y0, width, height: bandH })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const { r, g, b, picked } = vibrantAvg(data, info.channels);
        const hex = `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
        out.push({ portal: i + 1, id: ids[i], hex, rgb: [r, g, b], vibrantPixels: picked });
    }

    console.log(JSON.stringify({ imageSize: { w, h }, band: { y0, y1 }, samples: out }, null, 2));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
