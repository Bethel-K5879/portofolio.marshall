'use strict';
/**
 * Affiche les messages reçus via le formulaire de contact (data/messages.jsonl).
 * Usage : npm run messages
 */
const fs = require('node:fs');
const path = require('node:path');

const file = process.env.MESSAGES_FILE || path.join(__dirname, '..', 'data', 'messages.jsonl');

if (!fs.existsSync(file)) {
  console.log('Aucun message reçu pour le moment.');
  process.exit(0);
}

const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
if (!lines.length) {
  console.log('Aucun message reçu pour le moment.');
  process.exit(0);
}

lines.forEach(function (line, i) {
  let m;
  try { m = JSON.parse(line); } catch (e) { return; }
  console.log('─'.repeat(60));
  console.log('#' + (i + 1) + '  ' + m.date);
  console.log('De         : ' + m.nom + (m.entreprise ? ' (' + m.entreprise + ')' : ''));
  console.log('Email      : ' + m.email);
  console.log('Message    :\n' + m.message);
});
console.log('─'.repeat(60));
console.log(lines.length + ' message(s).');
