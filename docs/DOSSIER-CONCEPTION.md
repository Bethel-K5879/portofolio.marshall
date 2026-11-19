# Dossier de conception — Portfolio NIANGORAN Yeffe Marshall Edgard

Mode d'exécution : CONTINU · Profondeur : CONDENSE · Itérations LOOP max : 2 · Seuil qualité : 4/5 · Langue : fr.
Les notes des journaux LOOP sont des **auto-évaluations** ; les mesures (build, contrastes, Lighthouse) sont chiffrées dans la section QA.

---

## 0. Fiche `cvData` et registre des points à confirmer

| Champ | Valeur retenue (source : données fournies par l'utilisateur) |
|---|---|
| Nom / titre | NIANGORAN Yeffe Marshall Edgard — Technicien Supérieur en Finances, Comptabilité & Gestion d'Entreprise \| Chargé de Facturation & Gestionnaire Comptable |
| Ville | Abidjan, Côte d'Ivoire |
| Preset | **A — Architecte Minimal** `[HYPOTHÈSE]` (non choisi) |
| Expériences | 4 (CIE 2021–2024 ; EXPERTIZ GROUP juil.–oct. 2022 ; ICOGE (Chic-Shop) 2019–2020 ; Agence LA PROVIDENCE 2017–2018) |
| Compétences | 5 principales + 3 outils + 3 atouts, **aucun niveau** → Pattern 3 (tags) |
| Formation | 5 entrées (BTS 2022–2023 ; apprentissage ARSTM 2020–2021 ; L2 2018–2019 ; Bac G2 2016–2017 ; BEPC 2013–2014) + 2 attestations (novembre 2025) |
| Contacts rendus | email, 2 téléphones, ville. LinkedIn / GitHub / YouTube / Instagram : non fournis → **non rendus** |
| Stats hero | « Abidjan, Côte d'Ivoire » · « 4 expériences professionnelles » · « Disponible immédiatement » |

**Registre des `[À CONFIRMER]` / `[HYPOTHÈSE]`**

| Id | Point | Traitement |
|---|---|---|
| R-01 | Preset non choisi | A par défaut `[HYPOTHÈSE]` ; changement = 1 constante + 1 ligne de polices |
| R-02 | Texte « À propos » (107 mots) rédigé à partir des faits fournis lors d'une étape précédente, non écrit par l'utilisateur | `[À CONFIRMER]` — à relire ; le prompt demande 2-3 phrases, le texte en compte 4 |
| R-03 | Le prompt prévoit 3 expériences, 4 fournies | 4 conservées (aucune donnée supprimée) |
| R-04 | Lieu de EXPERTIZ GROUP, ICOGE, LA PROVIDENCE absent | champ omis, `[À CONFIRMER]` |
| R-05 | Résultats chiffrés absents | aucun chiffre affiché |
| R-06 | Stat « 4 expériences » = comptage des entrées fournies | `[HYPOTHÈSE]` (source : DAT-003) |
| R-07 | Stage juil.–oct. 2022 « Soutenance BTS » vs BTS 2022–2023 | dates appliquées telles quelles — `[À CONFIRMER]` |
| R-08 | Apprentissage « produits de la mer » dans un dossier finance | conservé, style discret et neutre |
| R-09 | Langues, centres d'intérêt et certifications ne sont pas dans les 8 sections imposées | intégrés dans E (langues, intérêts) et F (certifications) `[HYPOTHÈSE]` |
| R-10 | Formulaire avec honeypot de la version précédente | retiré : formulaire avec backend = Backlog ; remplacé par CTA `mailto:` |
| R-11 | `public/cv.pdf` est un PDF minimal | **à remplacer** par le vrai CV |
| R-12 | Photo fournie (lunettes de soleil) | utilisée ; une photo sans lunettes serait plus classique pour un recruteur en finance |
| R-13 | Email et téléphones publiés = données publiques ; cadre légal applicable | `[À CONFIRMER]` — pour la Côte d'Ivoire, vérifier la loi sur la protection des données personnelles et l'autorité de contrôle `[À VÉRIFIER]` |
| R-14 | Liens de la navbar limités aux 4 imposés | Formation n'a pas de lien dédié (accessible au défilement) |
| R-15 | Pas d'image Open Graph ni d'URL publique | à ajouter au déploiement |

---

## 1. PRD

**Résumé exécutif.** Vitrine personnelle animée, statique, pour un candidat à un poste en comptabilité et gestion financière. Message : rigueur comptable, facturation, flux, stocks, vigilance cyber.
**Public cible.** Recruteurs, cabinets d'expertise comptable, directions financières (PME et grandes entreprises, Côte d'Ivoire).

**User stories**
| Id | En tant que… |
|---|---|
| US-001 | recruteur, je télécharge le CV en un clic |
| US-002 | recruteur, je parcours les expériences dans l'ordre antéchronologique |
| US-003 | recruteur, je contacte la personne par email ou téléphone |
| US-004 | visiteur au clavier ou avec lecteur d'écran, je navigue sans obstacle |
| US-005 | visiteur sensible au mouvement, je vois le contenu sans animation |
| US-006 | visiteur sur mobile, je lis le site confortablement |
| US-007 | recruteur, je consulte compétences, formation et attestations |
| US-008 | recruteur, je comprends en quelques lignes le profil (à propos, identité, pied de page) |

**Fonctionnalités clés**
| Id | Fonctionnalité |
|---|---|
| FR-001 | Navbar flottante (transparente puis compacte floutée), menu mobile accessible |
| FR-002 | Hero 100dvh : photo, nom, titre, 3 indicateurs, 2 CTA |
| FR-003 | À propos : titre serif italique + paragraphe + points forts |
| FR-004 | Timeline d'expériences alternée (colonne unique en mobile) |
| FR-005 | Compétences en tags (Pattern 3) + langues + centres d'intérêt |
| FR-006 | Formation (5) + certifications (2) |
| FR-007 | Contact : email, téléphones, ville, CTA `mailto:` |
| FR-008 | Pied de page : nom, mention, année, indicateur « En ligne » |
| FR-009 | Téléchargement du CV (`<a download>`) |
| FR-010 | 4 presets pilotés par variables CSS |
| FR-011 | Animations GSAP + mode `prefers-reduced-motion` |
| FR-012 | Accessibilité WCAG 2.2 AA (landmarks, clavier, contrastes, cibles ≥ 44 px) |

**Critères d'acceptation mesurables**
| Id | Critère | Vérification |
|---|---|---|
| AC-001 | `npm run build` sans erreur | exécuté |
| AC-002 | 8 sections A→H dans l'ordre | inspection du DOM |
| AC-003 | 0 donnée inventée | revue ligne à ligne vs `cvData` |
| AC-004 | Contraste texte normal ≥ 4,5:1, grand texte ≥ 3:1 | script WCAG |
| AC-005 | Mouvement réduit : 0 élément masqué, 0 transform initial | test navigateur |
| AC-006 | 0 défilement horizontal à 360, 390, 768, 1280 px | test navigateur |
| AC-007 | Lighthouse accessibilité ≥ 95, performance ≥ 90 | mesure Lighthouse |

| Itération | Écarts détectés | Correction | Score |
|---|---|---|---|
| 1 | Identifiants cités vs définis (script, §10) | aucun écart | 4,5/5 (auto) |

---

## 2. TRD

**Architecture.** SPA statique Vite + React 19, sans backend ; `cvData` unique source du contenu (`src/App.jsx`) ; tokens en variables CSS (`src/index.css`).

**Stack et arbitrages (≥ 2 alternatives)**
| Décision | Retenu | Alternatives écartées | Raison |
|---|---|---|---|
| Build | Vite 8.3.8 | Next.js ; HTML pur | site statique, build rapide, SPA suffisante |
| Animations | GSAP 3.15.1 + ScrollTrigger | CSS pur ; Framer Motion | `matchMedia` et `context().revert()` couvrent reduced-motion et StrictMode |
| CSS | Tailwind **3.4.17** (v4 interdit) | CSS modules ; Tailwind v4 | contrainte du prompt, tokens via variables |
| Presets | variables CSS `rgb(var(--x) / <alpha>)` | classes par preset ; objet JS injecté | un seul jeu de classes, changement = 1 constante |
| Accent non contrasté | variantes `accent-text` (sur clair) et `accent-light` (sur sombre) | assombrir l'accent global | l'accent d'origine reste pour fonds et décors `[HYPOTHÈSE]` |
| Contact | CTA `mailto:` | formulaire + backend | backend = Backlog |

**Versions épinglées** (via `npm view`) : react / react-dom 19.3.1 · vite 8.3.8 · @vitejs/plugin-react 6.3.0 · tailwindcss 3.4.17 · postcss 8.5.33 · autoprefixer 10.6.2 · gsap 3.15.1 · lucide-react 1.74.0.

**Performance.** Objectifs : Lighthouse performance ≥ 90 (mesuré, §10). Une seule requête externe : Google Fonts (`preconnect`, `display=swap`). Animation de `transform` et `opacity` uniquement.
**Sécurité et conformité.** Pas de `dangerouslySetInnerHTML`, aucun script tiers hors polices, aucun traqueur. Email et téléphones sont publics (R-13).

| Itération | Écarts détectés | Correction | Score |
|---|---|---|---|
| 1 | Tailwind v4 risque d'être installé par défaut | version 3.4.17 épinglée sans `^` | 4,5/5 (auto) |

---

## 3. AppFlow

**Parcours visiteur**
1. Arrivée sur le hero : photo, nom, titre, indicateurs et CTA apparaissent en cascade (0,12 s).
2. Navbar transparente tant que la sentinelle du hero est visible, puis pilule compacte floutée.
3. Défilement : À propos → Expérience (fil qui se trace, cartes qui glissent, point qui pulse) → Compétences → Formation → Contact.
4. Actions : « Télécharger CV » (hero, navbar, contact), « Me contacter » (ancre), `mailto:`, `tel:`.

**États de la navbar.** Transparente (texte clair) · compacte (`bg-bg/60`, `backdrop-blur-xl`, bordure subtile) · mobile : bouton `aria-expanded`, fermeture par Échap (focus rendu au bouton) et à la sélection d'un lien.

**États de chargement et erreurs**
| Cas | Comportement |
|---|---|
| Photo introuvable | cercle gris avec initiales « MN » (testé) |
| Police en échec | pile de repli (`system-ui`, Georgia, monospace) ; `ScrollTrigger.refresh()` après `document.fonts.ready` |
| `cv.pdf` absent | le navigateur affiche son erreur 404 ; le fichier de remplacement est livré |
| JavaScript désactivé | message `<noscript>` avec email et téléphone |
| Mouvement réduit | états finaux directs, aucune pulsation |

| Itération | Écarts détectés | Correction | Score |
|---|---|---|---|
| 1 | Cas « une seule expérience / champ vide » | composants conditionnels (`return null`, items filtrés) | 4/5 (auto) |

---

## 4. UI/UX Design Specification

**Tokens du preset A** : Encre `#1C1C1E` (surface sombre), Corail `#E8634A` (accent, fonds et décors), Neige `#FAFAFA` (fond), Graphite `#2D2D2D` (texte). Dérivés calculés : `accent-text` `#D2381B`, `accent-light` `#E96B53`, secondaire `#6E6E71`, atténué sur sombre `#969696`, fond profond du pied de page `#0E0E10`. Titres Plus Jakarta Sans (tracking serré), dramatique Cormorant Garamond italique, données IBM Plex Mono.
**Texture et formes.** Bruit SVG `feTurbulence` à 5 % (pseudo-élément fixe), conteneurs `rounded-[2rem]` à `rounded-[4rem]`.
**Hiérarchie.** H1 massif (hero) > H2 serif italique > H3 sans gras > corps 17-20 px > mono (périodes, indicateurs).

| Section | Description |
|---|---|
| A Navbar | pilule fixe, initiales (mobile) ou nom court, 4 ancres, CTA accent |
| B Hero | 100dvh, fond Encre + halo d'accent 12 %, photo ronde 128-160 px bordure accent, nom, titre serif italique (2e ligne accent), indicateurs mono séparés par `\|`, 2 CTA |
| C À propos | 2 colonnes, ligne verticale accent 2 px, paragraphe 18-20 px |
| D Expérience | ligne centrale 1 px accent, cartes alternées, période mono accent, poste gras, entreprise normal secondaire |
| E Compétences | 3 cartes de tags (tailles par importance fournie), langues, centres d'intérêt |
| F Formation | bloc sombre arrondi, cartes empilées, apprentissage en style atténué, 2 attestations avec icône |
| G Contact | bloc accent arrondi, 4 éléments fournis, CTA `mailto:` + CV |
| H Pied de page | fond profond `rounded-t-[4rem]`, nom, mention, année, point vert pulsant (décoratif) |

**Interactions.** Boutons magnétiques (`scale(1.03)`, `cubic-bezier(0.25,0.46,0.45,0.94)`), liens `translateY(-1px)`, cartes d'expérience `scale(1.01)` + ombre. Stagger 0,08 (texte), 0,15 (cartes) ; exception hero 0,12.
**Accessibilité.** Lien d'évitement, landmarks, un seul `h1`, `aria-current` sur l'ancre active, focus visible (couleur adaptée au fond), cibles ≥ 44 px, `alt` pertinent, icônes `aria-hidden`.

| Itération | Écarts détectés | Correction | Score |
|---|---|---|---|
| 1 | Accent brut échoue en texte (3,19:1 sur Neige) | variantes `accent-text` / `accent-light` | 4,5/5 (auto) |
| 2 | Texte du bouton accent en blanc : ratio insuffisant | texte Encre sur accent (5,12:1) | 4,5/5 (auto) |

---

## 5. Backend Schema (adapté)

**Modèle `cvData`**
| Id | Champ | Type | Obligatoire | Règle d'omission |
|---|---|---|---|---|
| DAT-001 | `nom`, `nomCourt`, `initiales`, `titre`, `titreSecondaire`, `accroche`, `mention` | string | nom, titre | — |
| DAT-002 | `aPropos`, `pointsForts[]` | string, string[] | aPropos | points forts vides = bloc omis |
| DAT-003 | `experiences[]` : `periode`, `poste`, `entreprise`, `lieu?`, `points[]` | objets | oui | `lieu` absent = ligne omise ; liste vide = section omise |
| DAT-004 | `competences` : `principales[]`, `outils[]`, `atouts[]` | string[] | oui | pas de niveau = Pattern 3 |
| DAT-005 | `formation[]` : `annee`, `diplome`, `etablissement`, `discret?` | objets | non | liste vide = section F omise |
| DAT-006 | `certifications` : `periode`, `items[]` | objet | non | vide = bloc omis |
| DAT-007 | `contacts` : `email?`, `telephones[]`, `ville?` | objet | non | seuls les éléments fournis sont rendus ; sans email, CTA = « Télécharger mon CV » |
| DAT-008 | `stats[]` | string[] | non | dérivées des données fournies uniquement |
| DAT-009 | `langues[]`, `interets[]` | objets | non | liste vide = carte omise |
| DAT-010 | `photo`, `photoAlt`, `cvPath` | string | non | photo KO = initiales |

`API-xxx` et `TBL-xxx` : **N/A — site statique** (aucun serveur, aucune base).
**Interfaces externes :** `mailto:` (client mail du visiteur), `tel:` (application téléphone), téléchargement de `/cv.pdf`, Google Fonts.

| Itération | Écarts détectés | Correction | Score |
|---|---|---|---|
| 1 | Données hors schéma du prompt (langues, intérêts, attestations) | DAT-006 et DAT-009 ajoutés, rattachés à E et F | 4/5 (auto) |

---

## 6. Implementation Plan

| Phase | Objectifs | Livrables | Critères d'acceptation | Porte LOOP |
|---|---|---|---|---|
| PH-0 | Collecte et normalisation | `cvData`, registre R-01…R-15 | aucun champ inventé | validée |
| PH-1 | Dossier de conception | ce document | identifiants cohérents (§10) | validée |
| PH-2 | Tokens et scaffolding | config Vite/Tailwind/PostCSS, `index.css`, `index.html`, photo, `cv.pdf` | build OK, ratios calculés | validée |
| PH-3 | Composants A→H | `src/App.jsx` | 8 sections dans l'ordre | validée |
| PH-4 | Animations GSAP et reduced-motion | contexte GSAP, `matchMedia` | AC-005 | validée |
| PH-5 | QA | rapport §10 | AC-001, 004, 005, 006, 007 | validée après 2 itérations |
| PH-6 | Livraison | archive, README | commandes testées | validée |

| Itération | Écarts détectés | Correction | Score |
|---|---|---|---|
| 1 (PH-5) | Hero > 800 px de haut (CTA coupés) ; cibles tactiles 24-36 px ; séparateurs `\|` orphelins en mobile ; logo au nom accessible non conforme ; `robots.txt` invalide | tailles en `vh`, cibles 44 px, séparateurs masqués en mobile, `aria-label` incluant le texte visible, `robots.txt` ajouté | 4,5/5 |
| 2 (PH-5) | aucun écart résiduel hors environnement | — | 4,5/5 |

---

## 7. Matrice de traçabilité

| US | FR | CMP | DAT | PH |
|---|---|---|---|---|
| US-001 | FR-009, FR-001, FR-002, FR-007 | CMP-009, CMP-001, CMP-002, CMP-007 | DAT-010 | PH-3, PH-6 |
| US-002 | FR-004 | CMP-004 | DAT-003 | PH-3, PH-4 |
| US-003 | FR-007 | CMP-007 | DAT-007 | PH-3 |
| US-004 | FR-012 | CMP-001, CMP-002, CMP-003, CMP-004, CMP-005, CMP-006, CMP-007, CMP-008 | DAT-001 | PH-5 |
| US-005 | FR-011 | CMP-010 | DAT-001 | PH-4, PH-5 |
| US-006 | FR-001, FR-004 | CMP-001, CMP-004 | DAT-003 | PH-3, PH-5 |
| US-007 | FR-005, FR-006 | CMP-005, CMP-006 | DAT-004, DAT-005, DAT-006, DAT-009 | PH-3 |
| US-008 | FR-003, FR-008, FR-010 | CMP-003, CMP-008, CMP-010 | DAT-001, DAT-002, DAT-008 | PH-2, PH-3 |

**Composants** : CMP-001 Navbar · CMP-002 Hero · CMP-003 À propos · CMP-004 Expérience · CMP-005 Compétences · CMP-006 Formation · CMP-007 Contact · CMP-008 Pied de page · CMP-009 Bouton et effet magnétique · CMP-010 App (observateurs, GSAP, preset).

## 8. Frontière MVP / Backlog

**MVP (livré)** : 8 sections, 4 presets, animations, téléchargement du PDF, responsive, accessibilité.
**Backlog (non réalisé, interdit sans demande)** : formulaire avec backend, bascule clair/sombre, multilingue, CMS, blog, analytics, génération automatique du PDF, multi-pages.
**Demande de modification de structure** : refusée poliment et classée en Backlog.

## 9. Règles de résolution de conflits appliquées

1. Intégrité des données > 2. accessibilité et `prefers-reduced-motion` > 3. design system et architecture A→H > 4. tokens du preset > 5. détails esthétiques.
Cas rencontrés : accent échouant au contraste → variantes `accent-text` / `accent-light` ; stagger du hero 0,12 s (exception documentée) ; donnée manquante → champ omis et signalé au registre.

---

## 10. QA

**Build** : `npm run build` exécuté, succès (Vite 8.3.8, 2124 modules, JS 363 kB / 123 kB gzip, CSS 21 kB).
**Lighthouse** (Chromium headless, profil par défaut de l'outil, serveur de prévisualisation local) : **performance 97 · accessibilité 100 · bonnes pratiques 96 · SEO 100** · LCP 2,1 s · CLS 0 · TBT 70 ms. Seul audit en échec : « erreurs console », causée par le blocage de Google Fonts dans l'environnement de test (`ERR_TUNNEL_CONNECTION_FAILED`). À re-mesurer après déploiement.
**Audit npm** : 0 vulnérabilité sur les dépendances de production ; 12 « high » signalées uniquement dans l'outillage de build (chaîne `picomatch`) — non corrigées (`--force` aurait cassé les versions épinglées).
**Tests navigateur** : aucune erreur console en production et en mode développement (StrictMode) ; 1 seul `h1` ; 0 élément masqué après défilement ; 0 défilement horizontal à 360, 390, 768, 1280 px ; cibles interactives ≥ 44 px ; mouvement réduit : 0 opacité initiale, 0 transform initial, pulsation coupée ; clavier : lien d'évitement en premier `Tab`, menu mobile ouvert/fermé par Échap avec retour du focus, fermeture au clic sur un lien ; photo bloquée → initiales « MN ».

**Ratios de contraste calculés (formule WCAG) — preset A**

| Paire (texte / fond) | Couleurs | Ratio | Seuil | Résultat |
|---|---|---|---|---|
| Texte / fond clair | `#2D2D2D` / `#FAFAFA` | 13,19:1 | 4,5:1 | OK |
| Texte / carte blanche | `#2D2D2D` / `#FFFFFF` | 13,77:1 | 4,5:1 | OK |
| Secondaire / fond clair | `#6E6E71` / `#FAFAFA` | 4,87:1 | 4,5:1 | OK |
| Secondaire / carte blanche | `#6E6E71` / `#FFFFFF` | 5,08:1 | 4,5:1 | OK |
| Accent-texte / fond clair | `#D2381B` / `#FAFAFA` | 4,66:1 | 4,5:1 | OK |
| Accent-texte / carte blanche | `#D2381B` / `#FFFFFF` | 4,86:1 | 4,5:1 | OK |
| Texte clair / hero Encre | `#FAFAFA` / `#1C1C1E` | 16,3:1 | 4,5:1 | OK |
| Texte clair / hero pire cas (halo 12 %) | `#FAFAFA` / `#342523` | 14,02:1 | 4,5:1 | OK |
| Texte atténué / hero pire cas | `#969696` / `#342523` | 4,95:1 | 4,5:1 | OK |
| Accent-clair / hero pire cas | `#E96B53` / `#342523` | 4,66:1 | 4,5:1 | OK |
| Accent-clair / carte sombre | `#E96B53` / `#29292B` | 4,63:1 | 4,5:1 | OK |
| Accent-clair / surface sombre | `#E96B53` / `#1C1C1E` | 5,42:1 | 4,5:1 | OK |
| Texte du bouton accent / accent | `#1C1C1E` / `#E8634A` | 5,12:1 | 4,5:1 | OK |
| Texte atténué / carte sombre | `#969696` / `#29292B` | 4,91:1 | 4,5:1 | OK |
| Texte clair / carte sombre | `#FAFAFA` / `#29292B` | 13,91:1 | 4,5:1 | OK |
| Texte atténué / pied de page | `#969696` / `#0E0E0F` | 6,52:1 | 4,5:1 | OK |
| Texte clair / pied de page | `#FAFAFA` / `#0E0E0F` | 18,49:1 | 4,5:1 | OK |
| Texte / pill navbar (60 % clair) sur surface sombre | `#2D2D2D` / `#A1A1A2` | 5,34:1 | 4,5:1 | OK |

Éléments graphiques (bordure d'accent de la photo, seuil 3:1) : `#E96B53` sur le pire cas du hero → 4,66:1 (OK). Accent brut `#E8634A` : réservé aux fonds et décors ; en texte sur clair il donnerait 3,19:1 (échec), d'où `accent-text`.

**Autres presets** (mêmes paires, valeurs dérivées par le même script) : ratio minimum mesuré B 4,61:1 · C 4,65:1 · D 4,62:1 — toutes les paires ≥ 4,5:1. Les captures visuelles et les tests navigateur n'ont été faits que pour le preset A.

**Checklist**
| Contrôle | Résultat |
|---|---|
| Responsive 360 / 390 / 768 / 1280 px | testé |
| Clavier (Tab, Échap, lien d'évitement) | testé |
| `prefers-reduced-motion` | testé |
| Lecteurs d'écran réels (NVDA, VoiceOver) | non exécuté `[À VÉRIFIER]` |
| Presets B, C, D rendus à l'écran | non exécuté `[À VÉRIFIER]` |
| Lighthouse sur le site déployé | non exécuté `[À VÉRIFIER]` |

## 11. Identifiants — vérification croisée

- `US-xxx` : 8 identifiants cités, 0 hors plage définie
- `FR-xxx` : 12 identifiants cités, 0 hors plage définie
- `DAT-xxx` : 10 identifiants cités, 0 hors plage définie
- `CMP-xxx` : 10 identifiants cités, 0 hors plage définie
- `AC-xxx` : 7 identifiants cités, 0 hors plage définie
- `R-xxx` : 15 identifiants cités, 0 hors plage définie
- `PH-x` : 7 phases citées, 0 hors plage
- Couverture de la matrice (§7) — US: tous présents · FR: tous présents · DAT: tous présents · CMP: tous présents. PH-0 et PH-1 sont des phases documentaires, volontairement absentes de la matrice.
- Résultat du script : **aucun identifiant cité sans définition**

