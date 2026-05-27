# 🌐 Globalization Terminal — Team Setup Guide

> **A Project for GNED 07 : The Contemporary World**

---

## 🛠️ Prerequisites — Install These First

| Tool | Download Link | Why You Need It |
|------|--------------|-----------------|
| ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) | [git-scm.com/downloads](https://git-scm.com/downloads) | Version control & pushing code |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | [nodejs.org](https://nodejs.org) (v18+) | Runs the project locally |
| ![VSCode](https://img.shields.io/badge/VS_Code-007ACC?style=flat&logo=visualstudiocode&logoColor=white) | [code.visualstudio.com](https://code.visualstudio.com) | Recommended code editor |

---

## 👤 Step 1 — Get Added as a Collaborator

The **repo owner (Derrick)** must invite you first:

1. Go to the repo → **Settings → Collaborators → Add people**
2. Enter your **GitHub username**
3. Check your **email or GitHub notifications** and accept the invite

🔗 **Repo:** `https://github.com/derrickernestperez/Globalization-Terminal`

---

## 📥 Step 2 — Clone the Repo *(do this once)*

Open **Git Bash**, **PowerShell**, or **Terminal** and run:

```bash
git clone https://github.com/derrickernestperez/Globalization-Terminal.git
cd Globalization-Terminal
```

> ✅ This downloads the full project to your computer.

---

## 📦 Step 3 — Install Dependencies *(do this once)*

Inside the project folder, run:

```bash
npm install
```

> ✅ This installs React, Vite, Framer Motion, and all other packages.

---

## ▶️ Step 4 — Run the Project Locally

```bash
npm run dev
```

Then open your browser and go to:

```
http://localhost:5173
```

> ✅ You should see the Globalization Terminal running on your machine.

---

## 💾 Step 5 — Saving & Uploading Your Changes

Every time you finish working, follow these **4 commands in order:**

```bash
# 1️⃣ Always pull first — get your teammates' latest changes
git pull origin main

# 2️⃣ Stage all your changed files
git add .

# 3️⃣ Commit with a short description of what you did
git commit -m "describe your change here"

# 4️⃣ Push your work to GitHub
git push origin main
```

---

## ⚠️ Step 6 — Fixing Conflicts

If two people edited the same file at the same time, Git will show a conflict.

**Look for these markers inside the file:**

```
<<<<<<< HEAD
your version of the code
=======
your teammate's version
>>>>>>> main
```

**To fix it:**
1. Open the file in VS Code
2. Keep the correct version, delete the markers
3. Then run:

```bash
git add .
git commit -m "resolve merge conflict"
git push origin main
```

---

## 📋 Quick Reference Cheat Sheet

| Command | What It Does |
|---------|-------------|
| `git pull origin main` | ⬇️ Download latest team changes |
| `git status` | 👁️ See what files you changed |
| `git add .` | ➕ Stage all your changes |
| `git commit -m "msg"` | 💾 Save a snapshot with a message |
| `git push origin main` | ⬆️ Upload your changes to GitHub |
| `git log --oneline` | 📜 See recent commit history |
| `npm run dev` | ▶️ Start the local dev server |
| `npm install` | 📦 Install all dependencies |

---

## 🚨 Team Rules

- ✅ **Always `git pull` before you start working**
- ✅ **Write clear commit messages** so everyone knows what changed
- ❌ **Never commit the `node_modules` folder** (it's already in `.gitignore`)
- ❌ **Never push large binary files** (videos, zips, etc.)

---

## 👥 The Team

| Name | Role |
|------|------|
| Gito, Rhic Emmanuel | Frontend Developer |
| Mallari, Russell Mark A. | Backend Developer |
| Ocubillo, Gypsy Brygxs | UI/UX Designer |
| Perez, Derrick Ernest | Project Lead |
| Relosa, John Carlo B. | Full Stack Developer |

---

*Globalization Terminal · GNED 07 · 2026*
