# Portfolio — NIANGORAN Yeffe Marshall Edgard

Site statique Vite + React 19 + Tailwind 3.4.17 + GSAP 3.15.1 (preset A, Architecte Minimal).

## Lancer le projet
Prérequis : Node.js (version récente) installé.

    npm install
    npm run dev        # aperçu local (http://localhost:5173)
    npm run build      # fabrique le site final dans le dossier dist/
    npm run preview    # teste le site fabriqué

## À remplacer (sans toucher à la logique)
| Quoi | Où |
|---|---|
| **CV en PDF** (obligatoire : le fichier actuel est un PDF minimal) | `public/cv.pdf` (même nom) |
| Photo de profil (carrée, ~500 px) | `public/photo-marshall.jpg` (même nom) |
| Textes, expériences, compétences, formation, contacts | objet `cvData` en haut de `src/App.jsx` |
| Style (preset A, B, C ou D) | constante `PRESET` dans `src/App.jsx` + ligne de polices dans `index.html` (voir le commentaire) |
| Mention du pied de page | `mention` dans `cvData` |

## Mettre en ligne (gratuit)
- **Netlify** : `npm run build`, puis glisser-déposer le dossier `dist/` sur app.netlify.com/drop.
- **GitHub Pages / Vercel** : importer le dépôt ; commande de build `npm run build`, dossier de sortie `dist`.
Après mise en ligne : ajouter l'URL publique et une image de partage (Open Graph) dans `index.html`.

## Points à valider
Voir `docs/DOSSIER-CONCEPTION.md` (registre R-01 à R-15) : texte « À propos », dates du stage 2022 vs BTS, lieux des expériences, cadre légal des données personnelles.
