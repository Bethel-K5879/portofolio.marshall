import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  BadgeCheck,
  Download,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* =====================================================================
   RÉGLAGES — seule zone à modifier pour changer le contenu ou le style
   ===================================================================== */

// Direction esthétique : 'A' Architecte Minimal · 'B' Nocturne Prestige · 'C' Signal Brut · 'D' Aura Digitale
// (si vous changez de preset, remplacez aussi la ligne de polices dans index.html — voir le commentaire)
const PRESET = 'A'
document.documentElement.dataset.preset = PRESET

const cvData = {
  nom: 'NIANGORAN Yeffe Marshall Edgard',
  nomCourt: 'Marshall NIANGORAN',
  initiales: 'MN',
  titre: "Technicien Supérieur en Finances, Comptabilité & Gestion d'Entreprise",
  titreSecondaire: 'Chargé de Facturation & Gestionnaire Comptable',
  accroche:
    'Rigoureux, méthodique et orienté vers la performance financière, je mets ma maîtrise de la facturation, du suivi des flux et de la gestion de stock au service de la fiabilité de vos opérations comptables.',
  photo: '/photo-marshall.jpg', // fichier : public/photo-marshall.jpg (remplaçable)
  photoAlt:
    'Portrait de NIANGORAN Yeffe Marshall Edgard, en costume bleu marine à carreaux, chemise blanche, cravate rouge et lunettes de soleil',
  cvPath: '/cv.pdf', // fichier : public/cv.pdf (à remplacer par le vrai CV)
  mention: 'Fait avec le vibe coding',
  // Indicateurs du hero : uniquement dérivés des données fournies
  stats: ["Abidjan, Côte d'Ivoire", '4 expériences professionnelles', 'Disponible immédiatement'],

  aPropos:
    "Mon parcours académique, du Baccalauréat G2 au BTS Finances, Comptabilité et Gestion d'Entreprise, m'a donné une base solide en comptabilité et en gestion financière. Sur le terrain, j'ai assuré le suivi de la facturation clients à la CIE, appuyé les travaux comptables d'un cabinet d'expertise comptable et géré au quotidien la caisse d'une agence de transaction de flux. Ces missions m'ont appris à contrôler les pièces justificatives, à suivre les entrées et sorties de liquidités et à fiabiliser les données. J'apporte à mes collaborateurs un esprit d'équipe, de l'intégrité et un sens de l'organisation, ainsi qu'une vigilance constante face aux risques numériques qui menacent les données financières.",
  pointsForts: ['Facturation', 'Flux & caisse', 'Cybersécurité'],

  experiences: [
    {
      periode: '2021 – 2024',
      poste: 'Agent de Zone – Service Facturation',
      entreprise: "Compagnie Ivoirienne d'Électricité (CIE)",
      lieu: 'DR Abidjan Nord (Agence Cocody Angré Djibi)',
      points: [
        'Gestion et suivi des opérations de facturation clients sur le terrain.',
        'Contrôle de conformité, relevés et fiabilisation des données de consommation.',
        'Relation client et traitement des réclamations liées à la facturation.',
      ],
    },
    {
      periode: 'Juillet – Octobre 2022',
      poste: 'Stagiaire en Comptabilité (Soutenance BTS & Perfectionnement)',
      entreprise: 'Société EXPERTIZ GROUP',
      points: [
        'Participation aux travaux comptables courants : saisie, classement des pièces justificatives, établissement de factures.',
        'Appui au suivi administratif et financier des dossiers clients.',
      ],
    },
    {
      periode: '2019 – 2020',
      poste: 'Commercial',
      entreprise: 'Société ICOGE (Chic-Shop)',
      points: ['Suivi des ventes, gestion de la relation client, contribution au suivi des stocks.'],
    },
    {
      periode: '2017 – 2018',
      poste: "Gestionnaire d'Agence de Transaction de Flux",
      entreprise: 'Agence LA PROVIDENCE',
      points: [
        'Gestion quotidienne de la caisse, suivi des entrées et sorties de liquidités, arrêtés de caisse, sécurisation des opérations.',
      ],
    },
  ],

  // Aucun niveau fourni → Pattern 3 (tags). Taille = ordre d'importance fourni [HYPOTHÈSE]
  competences: {
    principales: [
      'Établissement de factures comptables',
      'Suivi de trésorerie et transaction de flux',
      'Gestion des stocks',
      'Contrôle et archivage de pièces comptables',
      'Appui commercial',
    ],
    outils: ['Microsoft Excel (tableaux de suivi, calculs)', 'Microsoft Word', 'Microsoft PowerPoint'],
    atouts: [
      'Sensibilisation aux menaces cyber et bonnes pratiques de sécurité informatique (protection des données financières)',
      'Habilitation aux ouvrages électriques basse tension',
      'Mobilité totale (Permis A, B, C, D, E)',
    ],
  },
  langues: [
    { nom: 'Français', niveau: 'Courant / langue de travail' },
    { nom: 'Anglais', niveau: 'Notions professionnelles' },
  ],
  interets: [
    { nom: 'Football', valeur: "Esprit d'équipe" },
    { nom: 'Sprint', valeur: 'Rigueur et dépassement de soi' },
    { nom: 'Lecture', valeur: 'Veille et culture générale' },
  ],

  formation: [
    {
      annee: '2022 – 2023',
      diplome: "BTS Finances, Comptabilité & Gestion d'Entreprise",
      etablissement: "Conservatoire Méthodiste de Côte d'Ivoire (CMAMCI)",
    },
    {
      annee: '2020 – 2021',
      diplome: 'Formation par apprentissage (Employé polyvalent des produits de mer)',
      etablissement: 'Académie Régionale des Sciences et Techniques de la Mer (ARSTM), Abidjan',
      discret: true,
    },
    {
      annee: '2018 – 2019',
      diplome: "Niveau Licence 2 en Finances, Comptabilité & Gestion d'Entreprise",
      etablissement: 'CMAMCI',
    },
    {
      annee: '2016 – 2017',
      diplome: 'Baccalauréat Technique Série G2 (Techniques Quantitatives de Gestion / Comptabilité)',
      etablissement: 'Groupe Scolaire Privé Prosper Mérimée, Cocody',
    },
    { annee: '2013 – 2014', diplome: 'BEPC', etablissement: 'Cours Secondaires Méthodistes de Cocody' },
  ],
  certifications: {
    periode: 'Novembre 2025',
    items: [
      { icone: 'shield', titre: 'Menaces cyber et bonnes pratiques en période électorale (sensibilisation cybersécurité)' },
      { icone: 'lock', titre: 'Comportements responsables et bons réflexes (éthique et conformité)' },
    ],
  },

  contacts: {
    email: 'marshallniangoran07@gmail.com',
    telephones: [
      { affiche: '(+225) 07 59 06 62 46', href: 'tel:+2250759066246' },
      { affiche: '(+225) 01 42 50 79 77', href: 'tel:+2250142507977' },
    ],
    ville: "Abidjan, Côte d'Ivoire",
  },
}

const NAV = [
  { id: 'a-propos', label: 'À propos' },
  { id: 'experience', label: 'Expérience' },
  { id: 'competences', label: 'Compétences' },
  { id: 'contact', label: 'Contact' },
]
const SECTION_IDS = ['a-propos', 'experience', 'competences', 'formation', 'contact']

/* =====================================================================
   COMPOSANTS PARTAGÉS
   ===================================================================== */

// Effet magnétique léger (bureau, souris, mouvement non réduit) — transform uniquement
function Magnetic({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let mm
    const ctx = gsap.context(() => {
      mm = gsap.matchMedia()
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
        const move = (e) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * 0.25)
          yTo((e.clientY - (r.top + r.height / 2)) * 0.25)
        }
        const leave = () => {
          xTo(0)
          yTo(0)
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        }
      })
    }, el)
    return () => {
      mm?.revert()
      ctx.revert()
    }
  }, [])
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  )
}

const BTN_BASE =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-[0.95rem] font-semibold transition duration-300 ease-soft hover:scale-[1.03] focus-visible:scale-[1.03]'
const BTN_VARIANTS = {
  accent: 'bg-accent text-on-accent hover:brightness-110',
  outline: 'border border-light/70 text-light hover:bg-light/10',
  ink: 'bg-ink text-light hover:brightness-125',
  outlineOnAccent: 'border-2 border-on-accent text-on-accent hover:bg-on-accent/10',
}

function Btn({ href, variant = 'accent', download, children, className = '', onClick, small = false }) {
  return (
    <Magnetic>
      <a
        href={href}
        download={download ? '' : undefined}
        onClick={onClick}
        className={`${BTN_BASE} ${small ? '!min-h-[44px] !px-5' : ''} ${BTN_VARIANTS[variant]} ${className}`}
      >
        {children}
      </a>
    </Magnetic>
  )
}

function SectionTitle({ id, children, tone = 'light', className = '' }) {
  return (
    <h2
      id={id}
      className={`font-title text-[clamp(2.4rem,6vw,4.5rem)] italic leading-[1.05] ${tone === 'dark' ? 'text-light' : tone === 'accent' ? 'text-on-accent' : 'text-ink'
        } ${className}`}
    >
      {children}
    </h2>
  )
}

/* =====================================================================
   A. NAVBAR — « La Signature Flottante »
   ===================================================================== */
function Navbar({ scrolled, active }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = 'link-u inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-medium hover:-translate-y-px'

  return (
    <header className="no-print pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto relative w-full max-w-4xl">
        <nav
          aria-label="Navigation principale"
          className={`flex items-center justify-between gap-2 rounded-full border px-3 py-2 pl-5 transition-colors duration-300 ease-soft sm:px-4 sm:pl-6 ${scrolled
              ? 'border-ink/10 bg-bg/60 text-txt shadow-lg backdrop-blur-xl'
              : 'on-dark border-transparent bg-transparent text-light'
            }`}
        >
          <a href="#top" className="inline-flex min-h-[44px] items-center font-semibold tracking-tight hover:-translate-y-px" aria-label={`${cvData.initiales} – ${cvData.nomCourt}, retour en haut`}>
            <span className="lg:hidden">{cvData.initiales}</span>
            <span className="hidden lg:inline">{cvData.nomCourt}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={`${linkClass} ${active === n.id ? 'font-semibold underline decoration-2 underline-offset-8' : ''}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <span className="hidden md:inline-flex">
              <Btn href={cvData.cvPath} download small variant="accent">
                <Download size={16} aria-hidden="true" /> Télécharger CV
              </Btn>
            </span>
            <button
              ref={btnRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="menu-mobile"
            className="mt-2 rounded-[2rem] border border-ink/10 bg-bg p-4 text-txt shadow-2xl md:hidden"
          >
            <ul className="flex flex-col">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={`flex min-h-[48px] items-center rounded-2xl px-4 text-base font-medium ${active === n.id ? 'bg-ink/5 font-semibold' : ''
                      }`}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 px-2 pb-1">
              <a
                href={cvData.cvPath}
                download
                onClick={() => setOpen(false)}
                className={`${BTN_BASE} w-full bg-accent text-on-accent`}
              >
                <Download size={18} aria-hidden="true" /> Télécharger CV
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

/* =====================================================================
   B. HERO — « La Première Impression »
   ===================================================================== */
function Hero({ sentinelRef }) {
  const [photoOk, setPhotoOk] = useState(Boolean(cvData.photo))
  return (
    <section
      id="top"
      aria-labelledby="hero-titre"
      className="hero-bg on-dark relative flex min-h-dvh flex-col items-center justify-center overflow-hidden rounded-b-[3rem] px-6 pb-12 pt-24 text-center text-light"
    >
      <div ref={sentinelRef} aria-hidden="true" className="absolute left-0 top-0 h-24 w-px" />

      <div className="h-photo">
        {photoOk ? (
          <img
            src={cvData.photo}
            alt={cvData.photoAlt}
            width="160"
            height="160"
            decoding="async"
            onError={() => setPhotoOk(false)}
            className="h-32 w-32 rounded-full border-2 border-accent-light object-cover sm:h-36 sm:w-36 lg:h-40 lg:w-40"
          />
        ) : (
          <div
            role="img"
            aria-label={`Initiales de ${cvData.nom}`}
            className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-accent-light bg-[#3A3A3E] font-sans text-3xl font-bold text-light sm:h-36 sm:w-36 lg:h-40 lg:w-40"
          >
            {cvData.initiales}
          </div>
        )}
      </div>

      <h1 className="h-name name-glow mt-6 max-w-5xl font-sans text-[clamp(2.5rem,min(8.4vw,10vh),6.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
        {cvData.nom}
      </h1>

      <p className="h-title mt-5 max-w-4xl font-title text-[clamp(1.3rem,min(2.6vw,3.6vh),2rem)] italic leading-snug">
        {cvData.titre}
        <span className="mt-1 block text-accent-light">{cvData.titreSecondaire}</span>
      </p>

      <ul
        className="h-stats mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[0.8rem] text-muted sm:text-sm"
        aria-label="Informations clés"
      >
        {cvData.stats.map((s, i) => (
          <li key={s} className="flex items-center gap-4">
            {i > 0 && (
              <span aria-hidden="true" className="hidden text-accent-light sm:inline">
                |
              </span>
            )}
            {s}
          </li>
        ))}
      </ul>

      <div className="h-cta mt-8 flex flex-wrap items-center justify-center gap-4">
        <Btn href={cvData.cvPath} download variant="accent">
          <Download size={18} aria-hidden="true" /> Télécharger CV
        </Btn>
        <Btn href="#contact" variant="outline">
          Me contacter <ArrowDown size={18} aria-hidden="true" />
        </Btn>
      </div>
    </section>
  )
}

/* =====================================================================
   C. À PROPOS — « Le Manifeste Personnel »
   ===================================================================== */
function About() {
  return (
    <section id="a-propos" aria-labelledby="apropos-titre" className="px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.5fr] md:gap-0">
        <div className="about-anim md:pr-12">
          <SectionTitle id="apropos-titre">À propos</SectionTitle>
        </div>
        <div className="about-anim border-accent pt-2 md:border-l-2 md:pl-12">
          <p className="text-[1.125rem] leading-[1.85] text-txt sm:text-[1.25rem]">{cvData.aPropos}</p>
          {cvData.pointsForts.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3" aria-label="Points forts">
              {cvData.pointsForts.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-ink/20 px-5 py-2 font-mono text-sm text-txt"
                >
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

/* =====================================================================
   D. EXPÉRIENCE — « La Timeline Vivante »
   ===================================================================== */
function Experience() {
  if (!cvData.experiences.length) return null
  return (
    <section
      id="experience"
      aria-labelledby="exp-titre"
      className="bg-bg px-6 pb-24 pt-8 sm:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionTitle id="exp-titre" className="exp-title mb-16 md:mb-24 md:text-center">
          Expérience
        </SectionTitle>

        <ol className="tl relative">
          <div
            aria-hidden="true"
            className="tl-line absolute bottom-0 left-3.5 top-0 w-px origin-top bg-accent md:left-1/2"
          />
          {cvData.experiences.map((e, i) => {
            const right = i % 2 === 1
            return (
              <li
                key={`${e.periode}-${e.poste}`}
                data-side={right ? 'right' : 'left'}
                className="exp-item relative mb-10 pl-12 last:mb-0 md:mb-14 md:grid md:grid-cols-2 md:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-3.5 top-9 z-10 -translate-x-1/2 md:left-1/2"
                >
                  <span className="exp-dot block h-3.5 w-3.5 rounded-full bg-accent ring-4 ring-bg" />
                </span>

                <div className={`exp-card ${right ? 'md:col-start-2 md:pl-14' : 'md:col-start-1 md:pr-14'}`}>
                  <article className="rounded-[2rem] bg-white p-7 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] transition duration-300 ease-soft hover:scale-[1.01] hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.35)] sm:p-9">
                    <p className="font-mono text-sm font-medium text-accent-text">{e.periode}</p>
                    <h3 className="mt-3 text-xl font-bold leading-snug text-ink sm:text-2xl">{e.poste}</h3>
                    <p className="mt-2 text-base font-normal text-secondary">{e.entreprise}</p>
                    {e.lieu && <p className="text-sm font-normal text-secondary">{e.lieu}</p>}
                    <ul className="mt-5 space-y-2.5 text-[1.0625rem] leading-relaxed text-txt">
                      {e.points.map((p) => (
                        <li key={p} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* =====================================================================
   E. COMPÉTENCES — « Le Tableau de Bord » (Pattern 3 : tags, aucun niveau fourni)
   ===================================================================== */
const TAG_SIZES = {
  principales: 'px-6 py-3 text-lg font-semibold sm:text-xl',
  outils: 'px-5 py-2.5 text-base font-medium',
  atouts: 'px-4 py-2 text-sm font-medium',
}

function Skills() {
  const groups = [
    ['principales', 'Comptabilité & Gestion'],
    ['outils', 'Outils Bureautiques & Informatiques'],
    ['atouts', 'Atouts Complémentaires & Sécurité'],
  ]
  return (
    <section id="competences" aria-labelledby="comp-titre" className="px-6 pb-24 pt-8 sm:pb-32">
      <div className="mx-auto max-w-6xl">
        <SectionTitle id="comp-titre" className="skills-anim mb-14">
          Compétences
        </SectionTitle>

        <div className="skills-cloud grid gap-6 md:grid-cols-2">
          {groups.map(([key, titre], idx) => (
            <div
              key={key}
              className={`rounded-[2rem] bg-white p-7 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] sm:p-9 ${idx === 0 ? 'md:col-span-2' : ''
                }`}
            >
              <h3 className="font-mono text-sm font-medium uppercase tracking-[0.12em] text-accent-text">
                {titre}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-3">
                {cvData.competences[key].map((c) => (
                  <li
                    key={c}
                    className={`skill-tag rounded-full border border-ink/15 bg-ink/5 text-txt ${TAG_SIZES[key]}`}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="skills-anim rounded-[2rem] bg-white p-7 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] sm:p-9">
            <h3 className="font-mono text-sm font-medium uppercase tracking-[0.12em] text-accent-text">Langues</h3>
            <ul className="mt-4">
              {cvData.langues.map((l) => (
                <li
                  key={l.nom}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-ink/10 py-3 last:border-0"
                >
                  <strong className="text-ink">{l.nom}</strong>
                  <span className="text-secondary">{l.niveau}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="skills-anim rounded-[2rem] bg-white p-7 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] sm:p-9">
            <h3 className="font-mono text-sm font-medium uppercase tracking-[0.12em] text-accent-text">
              Centres d&rsquo;intérêt
            </h3>
            <ul className="mt-4">
              {cvData.interets.map((l) => (
                <li
                  key={l.nom}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-ink/10 py-3 last:border-0"
                >
                  <strong className="text-ink">{l.nom}</strong>
                  <span className="text-secondary">{l.valeur}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =====================================================================
   F. FORMATION — « Les Fondations »
   ===================================================================== */
function Formation() {
  if (!cvData.formation.length) return null
  const icons = { shield: ShieldCheck, lock: Lock }
  return (
    <section
      id="formation"
      aria-labelledby="form-titre"
      className="on-dark mx-3 rounded-[3rem] bg-navy px-6 py-24 text-light sm:mx-6 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="form-titre" tone="dark" className="edu-anim mb-14">
          Formation &amp; Certifications
        </SectionTitle>

        <ol className="space-y-5">
          {cvData.formation.map((f) => (
            <li
              key={`${f.annee}-${f.diplome}`}
              className="edu-card rounded-[2rem] bg-light/[0.06] p-7 sm:p-9"
            >
              <p className="font-mono text-sm font-medium text-accent-light">{f.annee}</p>
              <h3
                className={`mt-2 ${f.discret ? 'text-base font-medium text-muted' : 'text-xl font-bold text-light sm:text-2xl'
                  }`}
              >
                {f.diplome}
              </h3>
              <p className={`mt-1 font-normal text-muted ${f.discret ? 'text-sm' : 'text-base'}`}>
                {f.etablissement}
              </p>
            </li>
          ))}
        </ol>

        {cvData.certifications.items.length > 0 && (
          <div className="mt-16">
            <h3 className="edu-anim font-mono text-sm font-medium uppercase tracking-[0.12em] text-accent-light">
              Certifications &amp; Attestations · {cvData.certifications.periode}
            </h3>
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {cvData.certifications.items.map((c) => {
                const Icon = icons[c.icone] || BadgeCheck
                return (
                  <li key={c.titre} className="edu-card flex items-start gap-4 rounded-[2rem] bg-light/[0.06] p-7">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent-light text-accent-light">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className="pt-1.5 text-lg font-semibold leading-snug text-light">{c.titre}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

/* =====================================================================
   G. CONTACT — « Le Pont »
   ===================================================================== */
function Contact() {
  const c = cvData.contacts
  const hasEmail = Boolean(c.email)
  const items = [
    ...(hasEmail ? [{ Icon: Mail, label: c.email, href: `mailto:${c.email}` }] : []),
    ...(c.telephones || []).map((t) => ({ Icon: Phone, label: t.affiche, href: t.href })),
    ...(c.ville ? [{ Icon: MapPin, label: c.ville }] : []),
  ]
  return (
    <section
      id="contact"
      aria-labelledby="contact-titre"
      className="on-accent mx-3 mt-6 rounded-[3rem] bg-accent px-6 py-24 text-on-accent sm:mx-6 sm:py-32"
    >
      <div className="mx-auto max-w-5xl text-center">
        <SectionTitle id="contact-titre" tone="accent" className="contact-anim">
          Travaillons ensemble
        </SectionTitle>
        <p className="contact-anim mx-auto mt-6 max-w-xl text-lg">
          Une mission de facturation, de suivi des flux ou de gestion de stock ? Écrivez-moi, je réponds.
        </p>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
          {items.map(({ Icon, label, href }) => (
            <li key={label} className="contact-item flex items-center gap-4 rounded-[2rem] border-2 border-on-accent/60 px-6 py-4">
              <Icon size={22} aria-hidden="true" className="shrink-0" />
              {href ? (
                <a href={href} className="link-u min-h-[44px] break-all py-2.5 font-medium hover:-translate-y-px">
                  {label}
                </a>
              ) : (
                <span className="font-medium">{label}</span>
              )}
            </li>
          ))}
        </ul>

        <div className="contact-anim mt-12 flex flex-wrap items-center justify-center gap-4">
          {hasEmail ? (
            <Btn
              variant="ink"
              href={`mailto:${c.email}?subject=${encodeURIComponent('Contact depuis votre portfolio')}`}
            >
              <Mail size={18} aria-hidden="true" /> Envoyer un message
            </Btn>
          ) : (
            <Btn variant="ink" href={cvData.cvPath} download>
              <Download size={18} aria-hidden="true" /> Télécharger mon CV
            </Btn>
          )}
          {hasEmail && (
            <Btn variant="outlineOnAccent" href={cvData.cvPath} download>
              <Download size={18} aria-hidden="true" /> Télécharger CV
            </Btn>
          )}
        </div>
      </div>
    </section>
  )
}

/* =====================================================================
   H. PIED DE PAGE
   ===================================================================== */
function Footer() {
  return (
    <footer className="on-dark mt-6 rounded-t-[4rem] bg-deep px-6 pb-10 pt-16 text-light">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <p className="text-lg font-bold tracking-tight">{cvData.nom}</p>
          <p className="mt-1 text-sm text-muted">
            © {new Date().getFullYear()} · {cvData.mention}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:items-end">
          <p className="flex items-center gap-2 font-mono text-sm text-muted">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="ping absolute inline-flex h-full w-full rounded-full bg-green-500" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            En ligne
          </p>
          <a href="#top" className="link-u inline-flex min-h-[44px] items-center text-sm font-medium hover:-translate-y-px">
            Retour en haut
          </a>
        </div>
      </div>
    </footer>
  )
}

/* =====================================================================
   APP — assemblage, observateurs et animations GSAP
   ===================================================================== */
export default function App() {
  const rootRef = useRef(null)
  const sentinelRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  // Navbar : transparente tant que la sentinelle du hero est visible
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Lien d'ancre actif
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECTION_IDS.forEach((id) => {
      const s = document.getElementById(id)
      if (s) io.observe(s)
    })
    return () => io.disconnect()
  }, [])

  // Animations : tout passe par gsap.context + matchMedia (mouvement réduit = états finaux directs)
  useEffect(() => {
    let mm
    const ctx = gsap.context(() => {
      mm = gsap.matchMedia()
      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { desktop } = context.conditions
          const trigger = (t, start = 'top 82%') => ({ trigger: t, start, once: true })

          // Hero : stagger 0,12 s (exception documentée à la règle « texte = 0,08 »)
          gsap.from(['.h-photo', '.h-name', '.h-title', '.h-stats', '.h-cta'], {
            y: 30,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
          })

          gsap.from('.about-anim', {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: trigger('#a-propos', 'top 75%'),
          })

          // Timeline : fil qui se trace, cartes qui glissent, point qui pulse une fois
          gsap.from('.exp-title', {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: trigger('.exp-title'),
          })
          gsap.from('.tl-line', {
            scaleY: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 70%', scrub: true },
          })
          gsap.utils.toArray('.exp-item').forEach((item) => {
            const right = item.dataset.side === 'right'
            const x = desktop ? (right ? 70 : -70) : -30
            const tl = gsap.timeline({ scrollTrigger: trigger(item, 'top 85%') })
            tl.from(item.querySelector('.exp-card'), { x, opacity: 0, duration: 0.9, ease: 'power3.out' })
            tl.to(
              item.querySelector('.exp-dot'),
              { scale: 1.7, duration: 0.3, ease: 'power2.inOut', yoyo: true, repeat: 1 },
              0.15,
            )
          })

          // Compétences : tags en cascade élastique
          gsap.from('.skills-anim', {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: trigger('.skills-cloud', 'top 85%'),
          })
          gsap.from('.skill-tag', {
            scale: 0.5,
            opacity: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.6)',
            stagger: 0.05,
            scrollTrigger: trigger('.skills-cloud', 'top 80%'),
          })

          // Formation
          gsap.from('.edu-anim', {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: trigger('#formation', 'top 75%'),
          })
          gsap.utils.toArray('.edu-card').forEach((card) => {
            gsap.from(card, {
              y: 40,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: trigger(card, 'top 90%'),
            })
          })

          // Contact
          gsap.from('.contact-anim', {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: trigger('#contact', 'top 75%'),
          })
          gsap.from('.contact-item', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: trigger('.contact-item', 'top 92%'),
          })
        },
      )
    }, rootRef)

    // Recalcule les positions quand les polices sont prêtes (réussies ou en échec)
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      mm?.revert()
      ctx.revert()
    }
  }, [])

  return (
    <div ref={rootRef}>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-light"
      >
        Aller au contenu
      </a>
      <Navbar scrolled={scrolled} active={active} />
      <main id="contenu" tabIndex={-1}>
        <Hero sentinelRef={sentinelRef} />
        <About />
        <Experience />
        <Skills />
        <Formation />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
