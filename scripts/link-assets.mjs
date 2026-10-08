import { existsSync, symlinkSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const links = [
  {
    target: resolve(rootDir, '../taxi-map/public/data/freiburg-3d'),
    link: resolve(rootDir, 'public/data/freiburg-3d'),
    desc: '3D LoD2 tileset from taxi-map'
  },
  {
    target: resolve(rootDir, '../taxi-turntables-pictures/public/cars'),
    link: resolve(rootDir, 'public/cars'),
    desc: 'Turntables and car photography from taxi-turntables-pictures'
  }
];

console.log('🔗 Linking sister repository assets for unified build...');

for (const { target, link, desc } of links) {
  if (!existsSync(target)) {
    console.warn(`  ⚠️ Target not found: ${target} (skipping ${desc})`);
    continue;
  }
  if (existsSync(link)) {
    console.log(`  ✓ Already linked: ${link}`);
    continue;
  }
  try {
    mkdirSync(dirname(link), { recursive: true });
    symlinkSync(target, link, 'dir');
    console.log(`  ✓ Successfully linked ${desc} -> ${link}`);
  } catch (err) {
    console.error(`  ❌ Failed to symlink ${link}:`, err.message);
  }
}
console.log('✅ Asset linking complete.');
