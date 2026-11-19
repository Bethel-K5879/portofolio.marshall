'use strict';
/** Copie le site construit (frontend/dist) vers public/ — utilisé par « npm run build:site ». */
const fs = require('node:fs');
const path = require('node:path');
const src = path.join(__dirname, '..', 'frontend', 'dist');
const dest = path.join(__dirname, '..', 'public');
if (!fs.existsSync(path.join(src, 'index.html'))) { console.error('frontend/dist introuvable : lancez d\'abord le build.'); process.exit(1); }
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log('Site copié dans public/');
