# 🐙 GitHub Repository Setup Guide

## Quick Start for GitHub Submission

This guide will help you push your project to GitHub and prepare it for submission.

---

## 📋 Prerequisites

- GitHub account (https://github.com)
- Git installed on your computer
- This project directory

---

## Step 1: Create GitHub Repository

### Method A: Using GitHub Web Interface

1. Go to https://github.com/new
2. Fill in repository details:
   - **Repository name**: `iot-smart-room-monitor` (or similar)
   - **Description**: "IoT Smart Room Monitor - Next.js + MQTT Application"
   - **Visibility**: Public (for instructor access)
   - **Initialize with README**: NO (we have our own)
   - **Add .gitignore**: Select "Node" template
3. Click "Create repository"

### Method B: Using GitHub CLI

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

gh repo create iot-smart-room-monitor --public --source=. --remote=origin
```

---

## Step 2: Configure Git (First Time Only)

```bash
# Set your Git username
git config --global user.name "Your Name"

# Set your Git email
git config --global user.email "your.email@example.com"

# Verify configuration
git config --global --list
```

---

## Step 3: Initialize and Push to GitHub

From your project directory:

```bash
# Initialize git repository (if not already done)
git init

# Add all files (except those in .gitignore)
git add .

# Verify what will be committed
git status

# Create initial commit
git commit -m "Initial commit: IoT Smart Room Monitor application

- Next.js 15 frontend with React hooks
- MQTT client for IoT device integration
- Real-time temperature monitoring
- Automatic AC control system
- Tailwind CSS responsive UI"

# Add GitHub repository as origin
# Replace YOUR_USERNAME and YOUR_REPO_NAME
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Verify Repository

1. Visit: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. Verify all files are present:
   - [ ] `app/` folder with `page.tsx`, `layout.tsx`, `globals.css`
   - [ ] `lib/` folder with `mqttClient.ts`
   - [ ] `README.md` (comprehensive documentation)
   - [ ] `package.json`, `tsconfig.json`, `tailwind.config.ts`
   - [ ] `.env.example` (configuration template)
   - [ ] `.gitignore` (node_modules should be excluded)
   - [ ] `MQTT_API.md`, `CODE_STRUCTURE.md`
   - [ ] `SUBMISSION_CHECKLIST.md`

---

## Step 5: Generate GitHub Link

Your submission link will be:

```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

Example:
```
https://github.com/john-doe/iot-smart-room-monitor
```

---

## 📋 Files That Should Be Tracked (✅)

```
✅ Source Code:
   - app/page.tsx
   - app/layout.tsx
   - app/globals.css
   - lib/mqttClient.ts

✅ Configuration:
   - package.json
   - tsconfig.json
   - tailwind.config.ts
   - next.config.js
   - postcss.config.js
   - .env.example
   - .gitignore

✅ Documentation:
   - README.md
   - MQTT_API.md
   - CODE_STRUCTURE.md
   - SUBMISSION_CHECKLIST.md
```

---

## 📋 Files That Should NOT Be Tracked (❌)

These are automatically excluded by `.gitignore`:

```
❌ node_modules/          (Run npm install locally)
❌ .next/                 (Build artifacts)
❌ .env.local             (Sensitive data)
❌ package-lock.json      (Can regenerate with npm install)
❌ dist/                  (Build output)
❌ .DS_Store              (macOS files)
❌ *.log                  (Log files)
```

---

## 🔄 After First Push

### Making Changes and Pushing Updates

```bash
# Make changes to files...

# Check what changed
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Update: Add MQTT error handling"

# Push to GitHub
git push
```

### Common Commands

```bash
# View commit history
git log --oneline

# View branch status
git branch -a

# Undo last commit (but keep changes)
git reset --soft HEAD~1

# View diff before committing
git diff

# Check remote URL
git remote -v
```

---

## 🆘 Troubleshooting

### Error: "fatal: not a git repository"

```bash
# Initialize git first
git init
```

### Error: "Could not read from remote repository"

```bash
# Verify SSH or HTTPS is configured correctly
git remote -v

# Update remote if needed
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Error: "Permission denied (publickey)"

```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Node_modules uploaded by mistake

```bash
# Remove from Git tracking (but keep locally)
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
git push

# Verify .gitignore includes node_modules
cat .gitignore | grep node_modules
```

---

## 📤 Submission Steps

### For GitHub Link Submission:

1. Ensure repository is public
2. Copy the URL: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
3. Submit in assignment portal/email

### Example Submission Format:

```
Project: IoT Smart Room Monitor
GitHub Link: https://github.com/john-doe/iot-smart-room-monitor
Tech Stack: Next.js 15, React, TypeScript, Tailwind CSS, MQTT
```

---

## 🔗 GitHub Repository Features

Once pushed, you can use GitHub features:

- **README.md**: Automatically displayed on repository home
- **Code**: Browse all source files online
- **Issues**: Track bugs or feature requests
- **Discussions**: Collaborate with others
- **Actions**: Set up CI/CD (optional)
- **Pages**: Deploy documentation (optional)

---

## 📝 Repository Description (GitHub)

Use this for your repository description:

```
IoT Smart Room Monitor - Interactive Next.js web application for real-time 
room environment monitoring and control with MQTT IoT integration. Features 
automatic AC control, comfort scoring, and Tailwind CSS responsive UI.
```

---

## 🎯 Final Checklist Before Submission

- [ ] Repository created on GitHub
- [ ] All source files pushed
- [ ] README.md displays correctly
- [ ] .env.example visible
- [ ] node_modules NOT included
- [ ] .gitignore properly configured
- [ ] Multiple commits in history
- [ ] Repository is PUBLIC
- [ ] Link works and is accessible
- [ ] Instructor can clone and run: `npm install && npm run dev`

---

## 📞 Still Need Help?

### GitHub Help Resources
- GitHub Docs: https://docs.github.com
- Git Basics: https://git-scm.com/book/en/v2
- GitHub Guides: https://guides.github.com

### Common Git Cheat Sheet

```bash
# Clone a repository
git clone https://github.com/user/repo.git

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# Delete branch
git branch -d feature-name

# View branches
git branch -a
```

---

**Ready to Submit?** Share your GitHub link with your instructor! 🚀

Last Updated: April 2026
