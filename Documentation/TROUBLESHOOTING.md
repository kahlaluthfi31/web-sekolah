# 🆘 Troubleshooting Guide

Solusi untuk masalah umum yang mungkin Anda temui.

---

## 📋 Table of Contents

- [Installation Issues](#installation-issues)
- [Runtime Errors](#runtime-errors)
- [Build Errors](#build-errors)
- [Styling Issues](#styling-issues)
- [Performance Issues](#performance-issues)
- [Environment & Configuration](#environment--configuration)

---

## 🔧 Installation Issues

### ❌ npm command not found

**Symptoms:**
```bash
'npm' is not recognized as an internal or external command
```

**Solution:**
1. Install Node.js dari [nodejs.org](https://nodejs.org/)
2. Restart terminal/command prompt
3. Verify: `node --version && npm --version`

---

### ❌ npm install fails with permission errors

**Symptoms:**
```
EACCES: permission denied
```

**Solution (Mac/Linux):**
```bash
# Option 1: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Option 2: Fix npm permissions
sudo chown -R $USER:$(id -gn $USER) ~/.npm
sudo chown -R $USER:$(id -gn $USER) ~/.config
```

**Solution (Windows):**
- Run PowerShell/CMD as Administrator
- Or install Node.js with administrator privileges

---

### ❌ Cannot find module 'lucide-react'

**Symptoms:**
```
Error: Cannot find module 'lucide-react'
```

**Solution:**
```bash
npm install lucide-react
```

If still failing:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Slow npm install

**Solutions:**

**1. Use faster package manager:**
```bash
# Install pnpm
npm install -g pnpm
pnpm install

# Or use yarn
npm install -g yarn
yarn install
```

**2. Clear npm cache:**
```bash
npm cache clean --force
npm install
```

**3. Use different registry:**
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 🚨 Runtime Errors

### ❌ Port 3000 is already in use

**Symptoms:**
```
Error: Port 3000 is already in use
```

**Solution Windows (PowerShell):**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Output: TCP 0.0.0.0:3000 LISTENING 12345
# Kill process (replace 12345 with actual PID)
taskkill /PID 12345 /F
```

**Solution Mac/Linux:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use one-liner
kill -9 $(lsof -ti:3000)
```

**Alternative: Use different port:**
```bash
npm run dev -- -p 3001
```

---

### ❌ Hydration Error

**Symptoms:**
```
Error: Hydration failed because the initial UI does not match
```

**Common Causes & Solutions:**

**1. Browser Extensions:**
```tsx
// Disable extensions or test in incognito mode
```

**Special case — `fdprocessedid` attribute (Edge/auto-fill extensions):**
- Sumbernya biasanya autofill/password manager (terutama Microsoft Edge) atau ekstensi yang menyuntik atribut `fdprocessedid` ke elemen `<button>`/`<input>` di sisi klien sebelum React melakukan hydration.
- Gejala: peringatan hydration mismatch yang hanya menunjukkan perbedaan atribut `fdprocessedid`.
- Solusi cepat: buka halaman di incognito/private window, nonaktifkan autofill/ekstensi form filler, atau coba browser lain. Jika harus tetap memakai ekstensi tersebut, Anda bisa menambahkan `suppressHydrationWarning` di root `<body>` untuk mengabaikan mismatch, tetapi sebaiknya hanya sebagai opsi terakhir karena dapat menyembunyikan mismatch lain.

**2. Inconsistent HTML structure:**
```tsx
// ❌ Wrong: Different structure on server/client
{typeof window !== 'undefined' && <div>Client Only</div>}

// ✅ Correct: Use useEffect for client-only
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
return <div>Client Content</div>;
```

**3. Invalid HTML nesting:**
```tsx
// ❌ Wrong: <p> inside <p>
<p><p>Nested</p></p>

// ✅ Correct: Use proper nesting
<div><p>Content</p></div>
```

---

### ❌ Module not found with @ alias

**Symptoms:**
```
Cannot find module '@/components/Navbar'
```

**Solution:**

Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Restart VS Code:**
- Close all files
- Restart VS Code
- Press `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

### ❌ useState not working

**Symptoms:**
```
React Hook "useState" cannot be called in a Server Component
```

**Solution:**

Add `'use client'` directive:
```tsx
'use client';

import { useState } from 'react';

export default function Component() {
  const [state, setState] = useState(0);
  // ...
}
```

---

### ❌ Images not loading

**Symptoms:**
- Images show broken icon
- 404 errors in console

**Solutions:**

**1. Check path (public folder):**
```tsx
// ✅ Correct
<img src="/images/logo.png" alt="Logo" />

// ❌ Wrong
<img src="images/logo.png" alt="Logo" />
<img src="./images/logo.png" alt="Logo" />
```

**2. Use Next.js Image:**
```tsx
import Image from 'next/image';

<Image 
  src="/images/logo.png" 
  alt="Logo"
  width={200}
  height={100}
/>
```

**3. Check file exists:**
```bash
ls public/images/
```

---

## 🏗️ Build Errors

### ❌ Build fails with TypeScript errors

**Symptoms:**
```
Type error: Cannot find name 'X'
```

**Solutions:**

**1. Install missing types:**
```bash
npm install -D @types/node @types/react @types/react-dom
```

**2. Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true
  }
}
```

**3. Restart TypeScript:**
- VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

### ❌ Out of memory during build

**Symptoms:**
```
FATAL ERROR: Reached heap limit
```

**Solution:**

Increase Node.js memory:
```bash
# Windows (PowerShell)
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Mac/Linux
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

Or add to `package.json`:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

### ❌ Webpack errors

**Symptoms:**
```
Module build failed
```

**Solution:**

Clear cache and rebuild:
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 🎨 Styling Issues

### ❌ Tailwind classes not working

**Symptoms:**
- Classes don't apply styling
- No errors in console

**Solutions:**

**1. Check Tailwind config:**
```javascript
// tailwind.config.ts
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

**2. Import globals.css:**
```tsx
// app/layout.tsx
import './globals.css';
```

**3. Check globals.css:**
```css
@import 'tailwindcss';
```

**4. Restart dev server:**
```bash
# Stop: Ctrl+C
npm run dev
```

---

### ❌ Custom CSS not applying

**Solutions:**

**1. Check import order:**
```tsx
// app/layout.tsx
import './globals.css';  // First
import './custom.css';   // Then custom
```

**2. Use CSS modules:**
```tsx
import styles from './Component.module.css';

<div className={styles.container}>...</div>
```

**3. Check CSS specificity:**
```css
/* More specific selector */
.custom-class {
  color: red !important;
}
```

---

### ❌ Fonts not loading

**Solution:**

Use next/font:
```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

---

## ⚡ Performance Issues

### ❌ Slow page loads

**Solutions:**

**1. Use Image optimization:**
```tsx
import Image from 'next/image';

<Image 
  src="/large-image.jpg"
  alt="Large"
  width={1920}
  height={1080}
  priority
/>
```

**2. Code splitting:**
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
});
```

**3. Reduce bundle size:**
```bash
# Analyze bundle
npm install -D @next/bundle-analyzer

# Check size
ANALYZE=true npm run build
```

---

### ❌ Memory leaks

**Solutions:**

**1. Clean up effects:**
```tsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  
  return () => clearInterval(timer); // Cleanup!
}, []);
```

**2. Cancel async operations:**
```tsx
useEffect(() => {
  let cancelled = false;
  
  fetchData().then(data => {
    if (!cancelled) setData(data);
  });
  
  return () => { cancelled = true; };
}, []);
```

---

## 🔐 Environment & Configuration

### ❌ Environment variables not working

**Symptoms:**
```
process.env.NEXT_PUBLIC_API_URL is undefined
```

**Solutions:**

**1. Check .env.local exists:**
```bash
ls -la | grep .env
```

**2. Use correct prefix:**
```env
# ✅ Correct (accessible in client)
NEXT_PUBLIC_API_URL=https://api.example.com

# ❌ Wrong (server-only)
API_URL=https://api.example.com
```

**3. Restart dev server:**
```bash
# Environment variables are loaded on start
# Ctrl+C to stop
npm run dev
```

**4. Check spelling:**
```tsx
// Must match exactly
const url = process.env.NEXT_PUBLIC_API_URL;
```

---

### ❌ Git issues

**Can't clone repository:**
```bash
# HTTPS authentication
git config --global credential.helper store
git clone https://github.com/user/repo.git

# SSH (if configured)
git clone git@github.com:user/repo.git
```

**Merge conflicts:**
```bash
# View conflicts
git status

# Resolve in editor, then:
git add .
git commit -m "Resolved conflicts"
```

---

## 🔍 Debugging Tips

### Enable Verbose Logging

```bash
# Next.js debug mode
DEBUG=* npm run dev

# Specific module
DEBUG=express:* npm run dev
```

### Check Console

**Browser (F12):**
- Console tab: JavaScript errors
- Network tab: API calls, failed requests
- Elements tab: Inspect DOM

**Terminal:**
- Server-side logs
- Build errors
- Warning messages

### Use React DevTools

1. Install [React DevTools](https://react.dev/learn/react-developer-tools)
2. Press F12 → Components/Profiler tabs
3. Inspect component props, state, hooks

---

## 📞 Get Help

If masalah belum terpecahkan:

1. **Check documentation:**
   - [Next.js Docs](https://nextjs.org/docs)
   - [React Docs](https://react.dev)

2. **Search existing issues:**
   - [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

3. **Ask for help:**
   - Open issue di repository
   - Next.js Discord community
   - React community forums

---

## ✅ Prevention Checklist

Hindari masalah dengan:

- [ ] Keep dependencies updated
- [ ] Use TypeScript for type safety
- [ ] Write clean, consistent code
- [ ] Test in multiple browsers
- [ ] Use Git for version control
- [ ] Read error messages carefully
- [ ] Check documentation first
- [ ] Use linter (ESLint)
- [ ] Format code (Prettier)
- [ ] Commit frequently with clear messages

---

**Still stuck? Don't hesitate to ask for help!** 🙋
