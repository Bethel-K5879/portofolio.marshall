'use strict';
/** Contrôles statiques du site construit (public/) : structure, fichiers référencés, données, absence d'invention. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const PUBLIC = path.join(__dirname, '..', 'public');
const html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
const refs = Array.from(html.matchAll(/(?:src|href)="(\/[^"]+)"/g), function (m) { return m[1]; });
const jsFile = refs.find(function (r) { return /\.js$/.test(r); });
const cssFile = refs.find(function (r) { return /\.css$/.test(r); });
const js = jsFile ? fs.readFileSync(path.join(PUBLIC, jsFile), 'utf8') : '';

test('page HTML : langue fr, titre, description, thème', function () {
  assert.match(html, /<html lang="fr">/);
  assert.match(html, /<title>NIANGORAN Yeffe Marshall Edgard/);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<meta name="theme-color"/);
});

test('fichiers référencés par index.html présents', function () {
  assert.ok(jsFile && cssFile, 'bundle JS ou CSS non référencé');
  refs.filter(function (r) { return !/^\/\//.test(r); }).forEach(function (r) {
    assert.ok(fs.existsSync(path.join(PUBLIC, r)), 'fichier manquant : ' + r);
  });
});

test('photo, CV et robots.txt livrés ; le CV est un vrai PDF', function () {
  ['photo-marshall.jpg', 'cv.pdf', 'robots.txt'].forEach(function (f) {
    assert.ok(fs.existsSync(path.join(PUBLIC, f)), 'manquant : ' + f);
  });
  assert.strictEqual(fs.readFileSync(path.join(PUBLIC, 'cv.pdf')).subarray(0, 5).toString(), '%PDF-');
});

test('le seul script externe autorisé est le bundle du site (aucun tiers)', function () {
  const scripts = Array.from(html.matchAll(/<script[^>]*src="([^"]+)"/g), function (m) { return m[1]; });
  scripts.forEach(function (s) { assert.ok(s.startsWith('/'), 'script tiers : ' + s); });
  assert.ok(!/<script(?![^>]*src)[^>]*>[\s\S]+?<\/script>/.test(html), 'script en ligne inattendu');
});

test('contenu : 8 composants, 4 expériences, 5 formations, 2 attestations', function () {
  ['Télécharger CV', 'Travaillons ensemble', 'Fait avec le vibe coding', 'Aller au contenu'].forEach(function (t) {
    assert.ok(js.includes(t), 'texte absent : ' + t);
  });
  ['Compagnie Ivoirienne d\'Électricité (CIE)', 'Société EXPERTIZ GROUP', 'Société ICOGE (Chic-Shop)', 'Agence LA PROVIDENCE'].forEach(function (t) {
    assert.ok(js.includes(t), 'expérience absente : ' + t);
  });
  ['2022 – 2023', '2020 – 2021', '2018 – 2019', '2016 – 2017', '2013 – 2014'].forEach(function (t) {
    assert.ok(js.includes(t), 'formation absente : ' + t);
  });
  assert.ok(js.includes('Menaces cyber et bonnes pratiques en période électorale'));
  assert.ok(js.includes('Comportements responsables et bons réflexes'));
});

test('coordonnées correctes (tel:, mailto:, CV)', function () {
  assert.ok(js.includes('tel:+2250759066246'));
  assert.ok(js.includes('tel:+2250142507977'));
  assert.ok(js.includes('marshallniangoran07@gmail.com'));
  assert.ok(js.includes('/cv.pdf'));
});

test('aucun texte factice ni pourcentage inventé dans les données', function () {
  assert.ok(!/lorem ipsum/i.test(js));
  const donnees = js.match(/aPropos:[`"][^`"]*[`"]/);
  assert.ok(donnees && !/\d+\s?%/.test(donnees[0]));
});

test('mouvement réduit géré dans le CSS et le JS', function () {
  const css = fs.readFileSync(path.join(PUBLIC, cssFile), 'utf8');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(js, /prefers-reduced-motion/);
});
