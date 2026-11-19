'use strict';
/** Tests du serveur : fichiers statiques, sécurité, API de contact. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createServer } = require('../server');

let server, base, messagesFile;

test.before(async function () {
  messagesFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-')), 'messages.jsonl');
  server = createServer({ messagesFile: messagesFile, trustProxy: true });
  await new Promise(function (resolve) { server.listen(0, '127.0.0.1', resolve); });
  base = 'http://127.0.0.1:' + server.address().port;
});

test.after(function () { server.close(); });

function post(body, ip) {
  return fetch(base + '/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': ip || '10.0.0.1' },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}
const valid = { nom: 'Awa Koné', entreprise: 'Cabinet Test', email: 'awa@example.com', message: 'Bonjour, je souhaite vous rencontrer.', consent: true, website: '' };

test('GET / renvoie le portfolio avec les en-têtes de sécurité', async function () {
  const r = await fetch(base + '/');
  assert.strictEqual(r.status, 200);
  assert.match(r.headers.get('content-type'), /text\/html/);
  assert.strictEqual(r.headers.get('x-content-type-options'), 'nosniff');
  assert.strictEqual(r.headers.get('x-frame-options'), 'DENY');
  assert.match(await r.text(), /NIANGORAN Yeffe Marshall Edgard/);
});

const fs2 = require('node:fs');
const indexHtml = fs2.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
const cssPath = indexHtml.match(/href="(\/assets\/[^"]+\.css)"/)[1];
const jsPath = indexHtml.match(/src="(\/assets\/[^"]+\.js)"/)[1];

test('CSS, JS, photo et CV sont servis avec le bon type', async function () {
  const css = await fetch(base + cssPath);
  assert.strictEqual(css.status, 200);
  assert.match(css.headers.get('content-type'), /text\/css/);
  const js = await fetch(base + jsPath);
  assert.match(js.headers.get('content-type'), /javascript/);
  assert.match(js.headers.get('cache-control'), /immutable/);
  const img = await fetch(base + '/photo-marshall.jpg');
  assert.strictEqual(img.status, 200);
  assert.strictEqual(img.headers.get('content-type'), 'image/jpeg');
  const pdf = await fetch(base + '/cv.pdf');
  assert.strictEqual(pdf.headers.get('content-type'), 'application/pdf');
});

test('politique CSP présente et sans script en ligne autorisé', async function () {
  const csp = (await fetch(base + '/')).headers.get('content-security-policy');
  assert.match(csp, /script-src 'self'/);
  assert.ok(!/unsafe-inline|unsafe-eval/.test(csp));
});

test('ETag : 304 sur requête conditionnelle', async function () {
  const first = await fetch(base + cssPath);
  const etag = first.headers.get('etag');
  const second = await fetch(base + cssPath, { headers: { 'If-None-Match': etag } });
  assert.strictEqual(second.status, 304);
});

test('404 sur page inconnue, 403 ou 404 sur traversée de dossier', async function () {
  assert.strictEqual((await fetch(base + '/nexiste-pas')).status, 404);
  const raw = await new Promise(function (resolve) {
    const http = require('node:http');
    http.get({ host: '127.0.0.1', port: server.address().port, path: '/..%2f..%2fserver.js' }, function (res) { resolve(res.statusCode); });
  });
  assert.ok(raw === 403 || raw === 404, 'statut : ' + raw);
});

test('/healthz répond ok', async function () {
  const r = await fetch(base + '/healthz');
  assert.deepStrictEqual(await r.json(), { ok: true });
});

test('POST /api/contact valide : 201 et message enregistré', async function () {
  const r = await post(valid, '10.0.0.2');
  assert.strictEqual(r.status, 201);
  const lines = fs.readFileSync(messagesFile, 'utf8').trim().split('\n');
  const saved = JSON.parse(lines[lines.length - 1]);
  assert.strictEqual(saved.nom, 'Awa Koné');
  assert.strictEqual(saved.email, 'awa@example.com');
  assert.ok(saved.date);
  assert.ok(!('ip' in saved), 'aucune adresse IP ne doit être stockée');
});

test('POST /api/contact invalide : 422 avec le détail des erreurs', async function () {
  const r = await post({ nom: 'A', email: 'pas-un-email', message: 'court', consent: false }, '10.0.0.3');
  assert.strictEqual(r.status, 422);
  const body = await r.json();
  assert.deepStrictEqual(Object.keys(body.errors).sort(), ['consent', 'email', 'message', 'nom']);
});

test('honeypot rempli : réponse ok mais rien enregistré', async function () {
  const before = fs.readFileSync(messagesFile, 'utf8');
  const r = await post(Object.assign({}, valid, { website: 'http://spam.example' }), '10.0.0.4');
  assert.strictEqual(r.status, 200);
  assert.strictEqual(fs.readFileSync(messagesFile, 'utf8'), before);
});

test('JSON invalide : 400 ; mauvais type : 415 ; GET : 405', async function () {
  assert.strictEqual((await post('{pas du json', '10.0.0.5')).status, 400);
  const r415 = await fetch(base + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'text/plain', 'X-Forwarded-For': '10.0.0.6' }, body: 'x' });
  assert.strictEqual(r415.status, 415);
  assert.strictEqual((await fetch(base + '/api/contact')).status, 405);
});

test('limite de débit : 429 après 5 messages en 10 minutes', async function () {
  let last;
  for (let i = 0; i < 6; i++) { last = await post(valid, '10.0.0.99'); }
  assert.strictEqual(last.status, 429);
});
