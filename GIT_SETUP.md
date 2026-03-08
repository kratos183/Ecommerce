# Git Setup Guide - Upload Project to GitHub

This guide will walk you through uploading your Ecommerce project to GitHub step by step.

## Prerequisites

- Git installed on your computer ([Download Git](https://git-scm.com/))
- GitHub account ([Sign up here](https://github.com/))
- Terminal/Command Prompt access

---

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Fill in the details:
   - **Repository name**: `Ecommerce` (or your preferred name)
   - **Description**: Optional - "Modern eCommerce web application built with Next.js"
   - **Visibility**: Choose **Public** or **Private**
   - **Important**: Do NOT check "Initialize this repository with a README"
   - Do NOT add .gitignore or license yet
5. Click **Create repository**
6. Keep this page open - you'll need the repository URL

---

## Step 2: Configure Git (First Time Only)

If you haven't configured Git before, set your username and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Verify configuration:

```bash
git config --list
```

---

## Step 3: Initialize Git in Your Project

Open terminal in your project directory:

```bash
cd "f:/notes/full web dev/web dev/Ecommerce/Ecommerce"
```

Initialize Git repository:

```bash
git init
```

You should see: `Initialized empty Git repository`

---

## Step 4: Create .gitignore File

Create a `.gitignore` file to exclude unnecessary files:

```bash
# Create .gitignore file
touch .gitignore
```

Add the following content to `.gitignore`:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Misc
*.pem
.vercel
```

---

## Step 5: Stage and Commit Your Files

Add all files to staging:

```bash
git add .
```

Check what will be committed:

```bash
git status
```

Commit your files:

```bash
git commit -m "Initial commit: Ecommerce Next.js project"
```

---

## Step 6: Connect to GitHub Repository

Add your GitHub repository as remote origin (replace with your actual username):

```bash
git remote add origin https://github.com/kratos183/Ecommerce.git
```

Verify remote was added:

```bash
git remote -v
```

---

## Step 7: Rename Branch to Main

GitHub uses `main` as the default branch name:

```bash
git branch -M main
```

---

## Step 8: Push to GitHub

### Option A: If GitHub Repository is Empty

```bash
git push -u origin main
```

### Option B: If GitHub Has Files (README/LICENSE)

If you get an error about remote containing work you don't have locally:

**Method 1 - Force Push (Overwrites GitHub content):**

```bash
git push -u origin main --force
```

**Method 2 - Pull and Merge (Keeps both):**

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## Step 9: Verify Upload

1. Go to your GitHub repository: `https://github.com/kratos183/Ecommerce`
2. Refresh the page
3. You should see all your project files

---

## Authentication Issues

If you encounter authentication errors, you have two options:

### Option 1: Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Ecommerce Project")
4. Select scopes: Check `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. When pushing, use the token as your password

### Option 2: GitHub CLI

Install GitHub CLI and authenticate:

```bash
# Install GitHub CLI (if not installed)
# Windows: Download from https://cli.github.com/

# Authenticate
gh auth login
```

Follow the prompts to authenticate.

---

## Common Git Commands for Future Use

### Check Status
```bash
git status
```

### Add Changes
```bash
git add .                    # Add all changes
git add filename.js          # Add specific file
```

### Commit Changes
```bash
git commit -m "Your commit message"
```

### Push Changes
```bash
git push                     # Push to current branch
git push origin main         # Push to main branch
```

### Pull Changes
```bash
git pull                     # Pull from current branch
git pull origin main         # Pull from main branch
```

### View Commit History
```bash
git log                      # Full history
git log --oneline            # Compact history
```

### Create New Branch
```bash
git checkout -b feature-name
```

### Switch Branches
```bash
git checkout main
git checkout feature-name
```

### View Branches
```bash
git branch                   # Local branches
git branch -a                # All branches
```

---

## Troubleshooting

### Error: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/kratos183/Ecommerce.git
```

### Error: "failed to push some refs"

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: "Permission denied"

- Check your GitHub credentials
- Use Personal Access Token instead of password
- Or use SSH keys

### Undo Last Commit (Not Pushed)

```bash
git reset --soft HEAD~1      # Keep changes
git reset --hard HEAD~1      # Discard changes
```

---

## Best Practices

1. **Commit Often**: Make small, frequent commits with clear messages
2. **Write Clear Commit Messages**: Describe what changed and why
3. **Never Commit Secrets**: Keep API keys, passwords in `.env.local` (gitignored)
4. **Pull Before Push**: Always pull latest changes before pushing
5. **Use Branches**: Create feature branches for new features
6. **Review Before Commit**: Use `git status` and `git diff` before committing

---

## Next Steps

After uploading to GitHub, you can:

1. **Deploy to Vercel**: Connect your GitHub repo to Vercel for automatic deployments
2. **Enable GitHub Actions**: Set up CI/CD pipelines
3. **Add Collaborators**: Invite team members to contribute
4. **Create Issues**: Track bugs and feature requests
5. **Set up Branch Protection**: Protect main branch from direct pushes

---

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)

---

## Support

If you encounter issues:
- Check [GitHub Status](https://www.githubstatus.com/)
- Visit [GitHub Community](https://github.community/)
- Review [Git Documentation](https://git-scm.com/doc)
