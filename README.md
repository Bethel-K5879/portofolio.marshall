# Portfolio – NIANGORAN Yeffe Marshall Edgard (Node.js)

Serveur **Node.js sans aucune dépendance** (Node 18 ou plus) qui sert le portfolio animé (React 19 + Tailwind + GSAP, preset A).

## Arborescence
```
portfolio-marshall-node/
├── server.js          Serveur : fichiers statiques, gzip, ETag, en-têtes de sécurité (CSP), /healthz, API de contact
├── package.json
├── public/            Le site construit (ce que voient les visiteurs)
│   ├── index.html, assets/ (JS, CSS), photo-marshall.jpg, cv.pdf, robots.txt
├── frontend/          Sources du site (React) — à modifier puis reconstruire
├── scripts/           copy-site.js (build), messages.js (lecture des messages)
├── test/              19 tests automatiques (site + serveur)
└── data/              Messages reçus par l'API (créé automatiquement)
```

## Démarrer
    npm start          # http://localhost:3000
    npm run dev        # idem, redémarre le serveur quand il change
    npm test           # 19 tests
Aucun `npm install` n'est nécessaire pour lancer le site.

## À remplacer
- **CV** : remplacer `public/cv.pdf` (le fichier actuel est un PDF minimal) — et aussi `frontend/public/cv.pdf` si vous reconstruisez.
- **Photo** : `public/photo-marshall.jpg` (carrée, ~500 px).

## Modifier le contenu ou le style
1. Éditer l'objet `cvData` en haut de `frontend/src/App.jsx` (textes, expériences, contacts) ou la constante `PRESET`.
2. Reconstruire : `npm run build:site` (installe les dépendances du front, construit, copie dans `public/`).

## Variables d'environnement (facultatives)
| Variable | Effet | Défaut |
|---|---|---|
| `PORT` | Port d'écoute | 3000 |
| `HOST` | Adresse d'écoute | 0.0.0.0 |
| `MESSAGES_FILE` | Fichier des messages | data/messages.jsonl |
| `TRUST_PROXY=1` | IP réelle derrière un proxy (limite de débit) | désactivé |

## Mise en ligne
Render, Railway, Fly.io ou tout hébergement Node : commande de démarrage `npm start` (activer `TRUST_PROXY=1` derrière un proxy).

## Notes
- L'API `POST /api/contact` (validation, anti-spam, limite de 5 messages / 10 min, aucune IP stockée) est conservée de la version précédente mais **le site actuel ne l'utilise pas** : son bouton « Envoyer un message » ouvre la messagerie (`mailto:`). Elle peut être branchée sur un formulaire à la demande.
- La politique de sécurité (CSP) n'autorise que le site lui-même et les polices Google. Si vous ajoutez un service externe, adaptez `server.js`.
- Voir aussi le dossier de conception : points à valider (texte « À propos », dates du stage 2022 vs BTS, lieux des expériences).
