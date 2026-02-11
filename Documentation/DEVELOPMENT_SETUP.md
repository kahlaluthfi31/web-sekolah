# 🔧 Development Setup & Environment

Panduan teknis untuk mengatur environment development.

---

## 💻 System Requirements

### Minimum Requirements
- **OS:** Windows 10/11, macOS 10.15+, atau Linux (Ubuntu 20.04+)
- **RAM:** 4GB (8GB recommended)
- **Storage:** 500MB free space
- **Internet:** Required for initial setup

### Required Software

#### 1. Node.js & npm

**Recommended Version:** Node.js 18.x LTS atau lebih baru

**Download & Install:**
- Windows/Mac: [nodejs.org](https://nodejs.org/)
- Linux (Ubuntu/Debian):
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

**Verify Installation:**
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show v9.x.x or higher
```

#### 2. Git

**Download & Install:**
- Windows: [git-scm.com](https://git-scm.com/)
- Mac: `brew install git`
- Linux: `sudo apt-get install git`

**Verify:**
```bash
git --version
```

#### 3. Code Editor (Recommended: VS Code)

**Download:** [code.visualstudio.com](https://code.visualstudio.com/)

**Recommended Extensions:**
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Path Intellisense

**Install Extensions (VS Code):**
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
```

---

## 📥 Project Setup

### Step 1: Clone Repository

```bash
# HTTPS
git clone https://github.com/yourusername/website-sekolah-nextjs.git

# SSH (if configured)
git clone git@github.com:yourusername/website-sekolah-nextjs.git

# Navigate to project
cd website-sekolah-nextjs
```

### Step 2: Install Dependencies

```bash
npm install
```

**What gets installed:**
- Production dependencies (in `dependencies`)
- Development dependencies (in `devDependencies`)
- Type definitions (@types/*)

**Package Lock:**
`package-lock.json` akan dibuat/diupdate untuk lock versi dependencies.

### Step 3: Environment Variables (Optional)

Jika project menggunakan environment variables:

**Create `.env.local` file:**
```bash
# Windows PowerShell
New-Item .env.local

# Mac/Linux
touch .env.local
```

**Add variables:**
```env
# Public (accessible in client)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://api.example.com

# Private (server-only)
DATABASE_URL=postgresql://localhost:5432/dbname
API_SECRET_KEY=your_secret_here
```

**Important:**
- ✅ `.env.local` is gitignored (not committed)
- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
- ❌ Never commit secrets to Git

---

## 🚀 Running the Project

### Development Mode

```bash
npm run dev
```

**What happens:**
- Next.js dev server starts on `http://localhost:3000`
- Hot Module Replacement (HMR) enabled
- Error overlay for debugging
- Fast refresh for instant updates

**Options:**
```bash
# Run on different port
npm run dev -- -p 3001

# Run on specific host
npm run dev -- -H 0.0.0.0

# Turbopack (experimental, faster)
npm run dev -- --turbo
```

### Production Mode

**Build:**
```bash
npm run build
```

**What happens:**
- TypeScript compilation
- Code optimization & minification
- Static page generation
- Image optimization
- Bundle analysis

**Start production server:**
```bash
npm start
```

**Access:** `http://localhost:3000`

### Lint & Type Check

**ESLint:**
```bash
npm run lint
```

**TypeScript check (if needed):**
```bash
npx tsc --noEmit
```

---

## 🔧 VS Code Configuration

### Settings (.vscode/settings.json)

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Launch Configuration (.vscode/launch.json)

For debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

---

## 📦 Package Management

### Check Outdated Packages

```bash
npm outdated
```

### Update Packages

```bash
# Update all to latest (respecting semver)
npm update

# Update specific package
npm update next

# Update to latest (breaking changes possible)
npm install next@latest
```

### Add New Package

```bash
# Production dependency
npm install package-name

# Dev dependency
npm install -D package-name

# Specific version
npm install package-name@1.2.3
```

### Remove Package

```bash
npm uninstall package-name
```

### Audit & Fix Vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix

# Force fix (may have breaking changes)
npm audit fix --force
```

---

## 🧪 Testing Setup (Optional)

If adding tests to the project:

### Install Jest & Testing Library

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Configure Jest

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### Add Test Script

In `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## 🐳 Docker Setup (Optional)

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

**Run:**
```bash
docker-compose up
```

---

## 🔍 Debugging

### Browser DevTools

**Chrome/Edge:**
- Press `F12` or `Ctrl+Shift+I`
- Go to Console tab for errors
- Network tab for API calls
- React DevTools extension for component inspection

### VS Code Debugging

1. Set breakpoint (click left of line number)
2. Press `F5` or use Debug panel
3. Select "Next.js: debug server-side" or "debug client-side"

### Console Logging

```tsx
// Server-side (terminal output)
console.log('Server:', data);

// Client-side (browser console)
console.log('Client:', data);
```

---

## 📊 Performance Monitoring

### Lighthouse

```bash
# Install globally
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

### Next.js Bundle Analyzer

```bash
npm install -D @next/bundle-analyzer
```

In `next.config.ts`:
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

**Run:**
```bash
ANALYZE=true npm run build
```

---

## 🛠️ Useful Commands

```bash
# Clear Next.js cache
rm -rf .next

# Clear all caches
rm -rf .next node_modules package-lock.json
npm install

# Check port usage
netstat -ano | findstr :3000     # Windows
lsof -ti:3000                    # Mac/Linux

# Kill process on port
taskkill /PID <PID> /F           # Windows
kill -9 $(lsof -ti:3000)         # Mac/Linux

# Find large files
npx npkill                        # Find and remove node_modules

# Security check
npm audit
npm audit fix
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [VS Code Tips](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)

---

## ✅ Setup Verification Checklist

- [ ] Node.js & npm installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server runs (`npm run dev`)
- [ ] Homepage loads at `http://localhost:3000`
- [ ] VS Code extensions installed
- [ ] No console errors
- [ ] Hot reload works (edit & save file)

---

**Setup complete! Start coding! 🚀**
