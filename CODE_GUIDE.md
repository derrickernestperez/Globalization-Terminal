# 📖 Code Guide for Teammates (Start Here!)

> **Don't panic.** You don't need to understand all of React to help on this project.
> Most safe changes are just editing **text**, **colors**, or **data** in specific files.

---

## 🧠 What is this project, in plain English?

This is a **website game** built with:

- **React** — builds the UI in reusable pieces called *components*
- **Vite** — runs the site on your computer (`npm run dev`)
- **Tailwind CSS** — styling with class names like `text-white`, `p-4`
- **No backend** — everything runs in the browser. No database. No server code to break.

Think of it like a **PowerPoint with buttons** — each screen is a component, and `App.jsx` decides which screen to show.

---

## 🗺️ How the app flows (3 main screens)

```
Landing Page  →  Game (3 stages)  →  Results Screen
     ↑                                      |
     └──────────── Play Again ──────────────┘
```

| Screen | File | What happens there |
|--------|------|--------------------|
| Landing | `src/components/LandingPage.jsx` | Name input, PLAY SOLO, CHALLENGER, How to Play tour |
| Game | `src/components/SimulationPreview.jsx` | All 3 stages: Geo, Flag Sort, Global Feud |
| Results | `src/components/ResultsScreen.jsx` | Final score, share code, personal best |

The **boss file** that switches screens is `src/App.jsx`.

---

## 📁 Folder map — what each part does

```
Globalization-Terminal/
├── src/
│   ├── main.jsx              ← Starts the app (rarely touch)
│   ├── App.jsx               ← Main controller: which screen is shown, sound, ticker
│   ├── index.css             ← Global styles (buttons, cards, colors)
│   ├── App.css               ← Extra layout styles
│   │
│   ├── components/           ← UI screens & pieces
│   │   ├── LandingPage.jsx       ← Home screen
│   │   ├── SimulationPreview.jsx ← The actual game (biggest file)
│   │   ├── ResultsScreen.jsx     ← End screen + share
│   │   ├── TutorialModal.jsx     ← "How to Play" guided tour
│   │   ├── LibraryModal.jsx      ← Grimoire / study PDFs
│   │   ├── Footer.jsx            ← Meet the Crew section
│   │   └── AnimatedGlobe.jsx     ← 3D globe for Geo stage
│   │
│   ├── data/                 ← ⭐ SAFEST PLACE TO EDIT
│   │   ├── gameData.js           ← Questions, flags, geo clues, feud answers
│   │   └── ContentLibrary.js     ← Grimoire study notes + PDF links
│   │
│   └── hooks/
│       └── useSound.js           ← Music & sound effects
│
├── public/                   ← Static files (images, PDFs)
├── package.json              ← List of packages (don't edit unless you know npm)
├── SETUP.md                  ← Git setup guide for the team
└── README.md                 ← Project overview
```

---

## ✅ Safe things to edit (low risk of breaking the app)

### 1. Game content — `src/data/gameData.js`
Change questions, answers, flag countries, geo clues, scores.
**This is the #1 file for content updates.**

### 2. Study notes — `src/data/ContentLibrary.js`
Change Grimoire text, summaries, PDF links.

### 3. Text on landing page — `src/components/LandingPage.jsx`
Change button labels, stage descriptions, error messages.
Look for text inside `"quotes"` or `'quotes'`.

### 4. Tutorial steps — `src/components/TutorialModal.jsx`
Top of file: `TOUR_STEPS` array — edit titles and instruction lines.

### 5. Team info — `src/components/Footer.jsx`
Developer names, photos, bios for "Meet the Crew".

### 6. Colors & fonts — `src/index.css`
Search for color codes like `#FF0080` (pink), `#00FFFF` (cyan), `#39FF14` (green).

### 7. Ticker text — `src/App.jsx`
Top of file: `TICKER_ITEMS` array — fake stock ticker strings.

---

## ⚠️ Edit with caution (ask the team first)

| File | Why it's tricky |
|------|-----------------|
| `SimulationPreview.jsx` | Very large (~1200 lines). Game logic, timers, scoring |
| `AnimatedGlobe.jsx` | Canvas/globe math — easy to break visually |
| `useSound.js` | Audio timing and browser rules |
| `App.jsx` | Controls entire app flow |
| `package.json` | Wrong change can break `npm install` |

**Rule:** If you're not sure, change **one small thing**, run `npm run dev`, and check the browser before pushing.

---

## 🚫 Do NOT edit

- `node_modules/` — auto-generated, never commit
- `dist/` — build output, recreated by `npm run build`
- `.env` files — we don't use secrets in this project anyway

---

## 🛠️ Before you change anything

```bash
git pull origin main    # get latest code first
npm run dev             # open http://localhost:5173
```

After editing:

1. Save the file
2. Browser should auto-refresh
3. Click through: Landing → Play Solo → finish a stage → Results
4. If it works, commit and push (see `SETUP.md`)

---

## 🎯 "I want to change X" — quick lookup

| I want to… | Go to… |
|------------|--------|
| Change a Feud question/answer | `src/data/gameData.js` |
| Change which countries appear in Flag Sort | `src/data/gameData.js` |
| Change geo clues | `src/data/gameData.js` |
| Change stage descriptions on home | `src/components/LandingPage.jsx` |
| Change How to Play tour text | `src/components/TutorialModal.jsx` → `TOUR_STEPS` |
| Change results share message | `src/components/ResultsScreen.jsx` |
| Change team member cards | `src/components/Footer.jsx` |
| Change pink/cyan/green colors | `src/index.css` |
| Change study PDF notes | `src/data/ContentLibrary.js` |

---

## 🧩 React basics (2-minute version)

- **Component** = one piece of UI (a button, a screen, a modal)
- **Props** = data passed from parent to child (like function arguments)
- **State** = data that changes (`useState`) — e.g. current score, player name
- **`useEffect`** = "do something when page loads or something changes"

You don't need to write these from scratch — mostly you'll edit **strings**, **numbers**, and **arrays** inside existing files.

---

## 🆘 If something breaks

1. **Undo in VS Code:** `Ctrl + Z`
2. **Discard all local changes:**
   ```bash
   git checkout -- .
   git pull origin main
   ```
3. **Ask in the group chat** — send a screenshot + which file you edited
4. **Worst case:** the repo on GitHub still has the last working version

---

## 📚 More help

- Git commands → read [SETUP.md](./SETUP.md)
- React basics → [react.dev/learn](https://react.dev/learn)
- Tailwind classes → [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

*You won't break the whole project by editing text in `gameData.js`. Start there.*
