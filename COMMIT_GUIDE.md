# 📝 Files to Commit vs Ignore - TiffinHub Project

## ✅ FILES TO COMMIT (Required for Code to Run)

### **Frontend Files (Root Directory)**
```
✅ app/                    # All Next.js pages and components
   ├── auth/
   ├── dashboard/
   ├── list/
   └── page.js, layout.js, globals.css, etc.

✅ public/                 # Static assets
   ├── background.jpg
   └── *.svg files

✅ styles/                 # CSS files
   ├── globals.css
   └── styles.css

✅ package.json            # Frontend dependencies
✅ package-lock.json       # Lock file for dependencies
✅ next.config.mjs         # Next.js configuration
✅ jsconfig.json           # JavaScript configuration
✅ eslint.config.mjs       # ESLint configuration
✅ README.md               # Project documentation
✅ scripts/                # Utility scripts
```

### **Backend Files (backend/ directory)**
```
✅ backend/
   ├── routes/            # API routes
   │   ├── auth.js
   │   ├── contact.js
   │   └── listings.js
   ├── models/            # MongoDB models
   │   ├── User.js
   │   └── Listing.js
   ├── middleware/         # Auth middleware
   │   └── auth.js
   ├── utils/             # Utility functions
   │   └── sendEmail.js
   ├── server.js          # Main server file
   ├── package.json       # Backend dependencies
   └── package-lock.json  # Lock file
```

---

## ❌ FILES TO NEVER COMMIT (Already in .gitignore)

### **Environment Variables (SECRET - Never Commit!)**
```
❌ .env                    # Backend environment variables
❌ .env.local              # Frontend environment variables
❌ .env.production         # Production secrets
❌ backend/.env            # Backend secrets
```

### **Dependencies & Build Files**
```
❌ node_modules/           # Installed packages (run npm install)
❌ backend/node_modules/   # Backend packages
❌ .next/                  # Next.js build output
❌ /out/                   # Next.js export output
❌ /build/                 # Build artifacts
```

### **System & IDE Files**
```
❌ .DS_Store               # macOS system file
❌ .idea/                   # IDE settings
❌ *.pem                    # Certificate files
❌ .vercel/                 # Vercel deployment files
```

### **Log Files**
```
❌ npm-debug.log*
❌ yarn-debug.log*
❌ yarn-error.log*
❌ .pnpm-debug.log*
```

---

## 📋 OPTIONAL: Create Example Files (Safe to Commit)

### **`.env.example` Files (Template - Safe to Commit)**

Create these files as templates (without real secrets):

**`backend/.env.example`** (Template for backend):
```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/tiffinhub

# Server Port
PORT=5000

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

**`.env.example`** (Template for frontend - root directory):
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🚀 Quick Commit Checklist

### **Step 1: Make sure these are committed:**
- ✅ All source code files (`app/`, `backend/routes/`, `backend/models/`, etc.)
- ✅ Configuration files (`package.json`, `next.config.mjs`, etc.)
- ✅ Static assets (`public/`, `styles/`)
- ✅ Documentation (`README.md`)

### **Step 2: Make sure these are NOT committed:**
- ❌ `.env` files (check `.gitignore` has `.env*`)
- ❌ `node_modules/` (check `.gitignore` has `/node_modules`)
- ❌ `.next/` build folder
- ❌ Any files with secrets/passwords

### **Step 3: Verify .gitignore is working:**
```bash
git status
# Should NOT show .env files or node_modules
```

---

## 📦 What Happens After Cloning?

When someone clones your repository, they need to:

1. **Install dependencies:**
   ```bash
   npm install              # Frontend
   cd backend && npm install # Backend
   ```

2. **Create environment files:**
   ```bash
   # Copy example files
   cp backend/.env.example backend/.env
   cp .env.example .env.local
   
   # Then edit with real values
   ```

3. **Run the application:**
   ```bash
   npm run dev              # Frontend (port 3000)
   cd backend && npm run dev # Backend (port 5000)
   ```

---

## 🔒 Security Reminder

**NEVER COMMIT:**
- Real `.env` files
- API keys
- Passwords
- JWT secrets
- Database connection strings with passwords
- SMTP credentials

**SAFE TO COMMIT:**
- `.env.example` files (templates without real values)
- Source code
- Configuration files (without secrets)
- Documentation

---

## ✅ Summary

**Must Commit:**
- All source code (`.js`, `.jsx`, `.css` files)
- Configuration files (`package.json`, `next.config.mjs`)
- Static assets (`public/`, `styles/`)
- Documentation (`README.md`)

**Never Commit:**
- `.env` files (secrets)
- `node_modules/` (dependencies)
- Build outputs (`.next/`, `/build/`)
- System files (`.DS_Store`, `.idea/`)

Your `.gitignore` file already handles most of this automatically! ✅

