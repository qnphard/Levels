/**
 * Sample average RGB from 8 horizontal slots (portal row) in an emulator screenshot.
 * Usage: node scripts/sample-portal-colors.cjs <path-to.png>
 */
const sharp = require('sharp');

async function main() {
    const imagePath = process.argv[2];
    if (!imagePath) {
        console.error('Usage: node scripts/sample-portal-colors.cjs <screenshot.png>');
        process.exit(1);
    }
    const meta = await sharp(imagePath).metadata();
    const w = meta.width;
    const h = meta.height;
    if (!w || !h) throw new Error('Could not read image dimensions');

    const y0 = Math.floor(h * 0.44);
    const y1 = Math.floor(h * 0.56);
    const bandH = Math.max(1, y1 - y0);
    const slotW = w / 8;
    const ids = [
        'courage',
        'willingness',
        'reason',
        'joy',
        'neutrality',
        'acceptance',
        'love',
        'peace',
    ];

    const out = [];
    for (let i = 0; i < 8; i++) {
        const cx = (i + 0.5) * slotW;
        const half = slotW * 0.32;
        const left = Math.max(0, Math.floor(cx - half));
        const width = Math.min(Math.ceil(half * 2), w - left);

        const { data, info } = await sharp(imagePath)
            .extract({ left, top: y0, width, height: bandH })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const ch = info.channels;
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        for (let p = 0; p < data.length; p += ch) {
            r += data[p];
            g += data[p + 1];
            b += data[p + 2];
            n++;
        }
        r = Math.round(r / n);
        g = Math.round(g / n);
        b = Math.round(b / n);
        const hex = `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
        out.push({ portal: i + 1, id: ids[i], hex, rgb: [r, g, b] });
    }

    console.log(JSON.stringify({ imageSize: { w, h }, band: { y0, y1 }, samples: out }, null, 2));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
