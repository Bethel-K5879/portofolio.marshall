'use strict';
/**
 * Serveur Node.js du portfolio – aucune dépendance externe (Node 18+).
 *  - Sert le dossier public/ (site React construit : HTML, JS, CSS, images, cv.pdf) avec cache, ETag et gzip.
 *  - Expose POST /api/contact : valide le message et l'enregistre dans data/messages.jsonl.
 *  - Ajoute des en-têtes de sécurité de base.
 *
 * Lancer : npm start   (puis ouvrir http://localhost:3000)
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const ROOT = path.join(__dirname, 'public');
const DEFAULT_MESSAGES_FILE = path.join(__dirname, 'data', 'messages.jsonl');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2'
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.txt', '.svg']);

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // Le site charge ses scripts/styles depuis lui-même ; seules les polices Google sont externes
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
};

/* ---------- Utilitaires ---------- */
function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({}, SECURITY_HEADERS, headers));
  res.end(body);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj), {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
}

function clean(value, max) {
  // supprime les caractères de contrôle (sauf retours à la ligne) et borne la longueur
  return String(value == null ? '' : value)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

/* ---------- Fichiers statiques ---------- */
const gzipCache = new Map(); // clé : chemin + mtime -> Buffer

function serveStatic(req, res, pathname) {
  let rel;
  try { rel = decodeURIComponent(pathname); } catch (e) { return send(res, 400, 'Requête invalide'); }
  if (rel.includes('\0')) { return send(res, 400, 'Requête invalide'); }
  if (rel.endsWith('/')) { rel += 'index.html'; }

  const filePath = path.normalize(path.join(ROOT, rel));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    return send(res, 403, 'Accès refusé');   // tentative de sortie du dossier public/
  }

  fs.stat(filePath, function (err, stat) {
    if (err || !stat.isFile()) { return notFound(res); }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    const etag = '"' + stat.size.toString(16) + '-' + Math.floor(stat.mtimeMs).toString(16) + '"';
    const headers = {
      'Content-Type': type,
      'ETag': etag,
      'Last-Modified': stat.mtime.toUTCString(),
      // Fichiers générés par Vite (nom + empreinte) : cache d'un an ; le reste : 1 jour
      'Cache-Control': ext === '.html' ? 'no-cache'
        : /^\/assets\/.+-[A-Za-z0-9_-]{8}\.(js|css)$/.test(rel) ? 'public, max-age=31536000, immutable'
        : 'public, max-age=86400'
    };

    if (req.headers['if-none-match'] === etag) { return send(res, 304, '', headers); }

    const wantsGzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    if (wantsGzip) {
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
    }

    if (req.method === 'HEAD') { return send(res, 200, '', headers); }

    fs.readFile(filePath, function (readErr, data) {
      if (readErr) { return notFound(res); }
      if (!wantsGzip) { headers['Content-Length'] = data.length; return send(res, 200, data, headers); }
      const key = filePath + ':' + etag;
      let zipped = gzipCache.get(key);
      if (!zipped) { zipped = zlib.gzipSync(data); gzipCache.set(key, zipped); }
      headers['Content-Length'] = zipped.length;
      send(res, 200, zipped, headers);
    });
  });
}

function notFound(res) {
  send(res, 404,
    '<!doctype html><html lang="fr"><meta charset="utf-8"><title>Page introuvable</title>' +
    '<body style="font-family:system-ui,sans-serif;padding:3rem;color:#1C1C1E">' +
    '<h1>Page introuvable</h1><p><a href="/">Retour au portfolio</a></p></body></html>',
    { 'Content-Type': 'text/html; charset=utf-8' });
}

/* ---------- API de contact ---------- */
function createContactHandler(options) {
  const messagesFile = options.messagesFile;
  const trustProxy = options.trustProxy;
  const hits = new Map();                       // limite de débit : ip -> [horodatages]
  const WINDOW_MS = 10 * 60 * 1000;
  const MAX_PER_WINDOW = 5;

  function rateLimited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(function (t) { return now - t < WINDOW_MS; });
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) { hits.clear(); }     // évite une croissance illimitée
    return recent.length > MAX_PER_WINDOW;
  }

  return function handleContact(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return sendJson(res, 405, { ok: false, error: 'Méthode non autorisée' });
    }

    const type = (req.headers['content-type'] || '').split(';')[0].trim();
    if (type !== 'application/json') {
      return sendJson(res, 415, { ok: false, error: 'Format attendu : application/json' });
    }

    let ip = req.socket.remoteAddress || 'inconnue';
    if (trustProxy && req.headers['x-forwarded-for']) { ip = String(req.headers['x-forwarded-for']).split(',')[0].trim(); }
    if (rateLimited(ip)) { return sendJson(res, 429, { ok: false, error: 'Trop de messages, réessayez plus tard.' }); }

    let size = 0;
    const chunks = [];
    let aborted = false;
    req.on('data', function (chunk) {
      size += chunk.length;
      if (size > 10 * 1024) {
        aborted = true;
        sendJson(res, 413, { ok: false, error: 'Message trop volumineux' });
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', function () {
      if (aborted) { return; }
      let data;
      try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) {
        return sendJson(res, 400, { ok: false, error: 'JSON invalide' });
      }
      if (!data || typeof data !== 'object') { return sendJson(res, 400, { ok: false, error: 'Données invalides' }); }

      // Champ piège (honeypot) rempli : on répond « ok » sans rien enregistrer
      if (clean(data.website, 200)) { return sendJson(res, 200, { ok: true }); }

      const entry = {
        date: new Date().toISOString(),
        nom: clean(data.nom, 120),
        entreprise: clean(data.entreprise, 120),
        email: clean(data.email, 200),
        message: clean(data.message, 2000)
      };
      const errors = {};
      if (entry.nom.length < 2) { errors.nom = 'Nom requis'; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(entry.email)) { errors.email = 'Email invalide'; }
      if (entry.message.length < 10) { errors.message = 'Message trop court (10 caractères minimum)'; }
      if (data.consent !== true) { errors.consent = 'Consentement requis'; }
      if (Object.keys(errors).length) { return sendJson(res, 422, { ok: false, errors: errors }); }

      fs.mkdir(path.dirname(messagesFile), { recursive: true }, function (mkErr) {
        if (mkErr) { return sendJson(res, 500, { ok: false, error: 'Enregistrement impossible' }); }
        fs.appendFile(messagesFile, JSON.stringify(entry) + '\n', function (err) {
          if (err) { return sendJson(res, 500, { ok: false, error: 'Enregistrement impossible' }); }
          sendJson(res, 201, { ok: true });
        });
      });
    });
  };
}

/* ---------- Serveur ---------- */
function createServer(options) {
  options = options || {};
  const handleContact = createContactHandler({
    messagesFile: options.messagesFile || process.env.MESSAGES_FILE || DEFAULT_MESSAGES_FILE,
    trustProxy: options.trustProxy != null ? options.trustProxy : process.env.TRUST_PROXY === '1'
  });

  return http.createServer(function (req, res) {
    const pathname = new URL(req.url, 'http://localhost').pathname;

    if (pathname === '/api/contact') { return handleContact(req, res); }
    if (pathname === '/healthz') { return sendJson(res, 200, { ok: true }); }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD');
      return send(res, 405, 'Méthode non autorisée');
    }
    serveStatic(req, res, pathname);
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';
  const server = createServer();
  server.listen(port, host, function () {
    console.log('Portfolio disponible sur http://localhost:' + port);
  });
  const stop = function () { server.close(function () { process.exit(0); }); };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

module.exports = { createServer };
