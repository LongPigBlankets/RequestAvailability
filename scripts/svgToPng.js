import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const assetsDir = path.join(projectRoot, 'public', 'assets');
const inputSvg = path.join(assetsDir, 'buyagift-by-moonpig.svg');
const outputPng = path.join(assetsDir, 'buyagift-by-moonpig.png');

async function convert() {
  if (!fs.existsSync(inputSvg)) {
    console.error('Input SVG not found at', inputSvg);
    process.exit(1);
  }
  const svgBuffer = fs.readFileSync(inputSvg);
  await sharp(svgBuffer, { density: 384 })
    .png({ compressionLevel: 9 })
    .toFile(outputPng);
  console.log('Wrote', outputPng);
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});

