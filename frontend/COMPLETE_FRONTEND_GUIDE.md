# 🎨 Complete Frontend Setup Guide

## 📦 What We've Built

A complete React frontend with:
- ✅ 8 Pages (Home, Login, Register, Dashboard, Reports, CreateReport, Schedules, AdminDashboard)
- ✅ Authentication system with JWT
- ✅ Protected routes
- ✅ Image upload functionality
- ✅ Charts and analytics (Recharts)
- ✅ Responsive design (Tailwind CSS)
- ✅ Modern UI with Lucide icons

---

## 🚀 Step-by-Step Setup

### Step 1: Create Vite Project

```powershell
# Navigate to project root
cd C:\Users\MAINUU.8975\Desktop\smart-waste-management

# Create frontend
npm create vite@latest frontend -- --template react

# Navigate to frontend
cd frontend
```

### Step 2: Install Dependencies

```powershell
# Install all packages
npm install

# Install additional required packages
npm install axios react-router-dom lucide-react recharts

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### Step 3: Create Folder Structure

```powershell
# Create all folders
mkdir src\components
mkdir src\pages
mkdir src\context
mkdir src\services
mkdir src\utils
```

Your structure should look like:
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
```

### Step 4: Copy Configuration Files

#### **1. vite.config.js** (Replace existing)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

#### **2. tailwind.config.js** (Replace existing)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
```

#### **3. postcss.config.js** (Create new)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### **4. .env** (Create new)
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Copy Core Files

Copy from artifacts to your project:

**src/index.css** - Replace entire file with the CSS from artifacts
**src/main.jsx** - Replace with artifact version
**src/App.jsx** - Replace with artifact version

### Step 6: Copy Service & Context Files

**src/services/api.js** - Copy from artifacts
**src/context/AuthContext.jsx** - Copy from artifacts

### Step 7: Copy Components

**src/components/Navbar.jsx** - Copy from artifacts
**src/components/ProtectedRoute.jsx** - Copy from artifacts

### Step 8: Copy All Pages

Copy all 8 pages from artifacts:

1. **src/pages/Home.jsx**
2. **src/pages/Login.jsx**
3. **src/pages/Register.jsx**
4. **src/pages/Dashboard.jsx**
5. **src/pages/Reports.jsx**
6. **src/pages/CreateReport.jsx**
7. **src/pages/Schedules.jsx**
8. **src/pages/AdminDashboard.jsx**

---

## ✅ Verification Checklist

After copying all files, verify:

```powershell
# Check file structure
dir src\components
dir src\pages
dir src\context
dir src\services

# You should see:
# components: Navbar.jsx, ProtectedRoute.jsx
# pages: Home.jsx, Login.jsx, Register.jsx, Dashboard.jsx, Reports.jsx, CreateReport.jsx, Schedules.jsx, AdminDashboard.jsx
# context: AuthContext.jsx
# services: api.js
```

---

## 🎯 Run the Application

### 1. Start Backend (if not running)

```powershell
# In backend folder
cd ..\backend
npm run dev
```

Should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

### 2. Start Frontend

```powershell
# In frontend folder
cd ..\frontend
npm run dev
```

Should see:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 3. Open Browser

Visit: **http://localhost:5173**

---

## 🧪 Testing the Application

### Test 1: Homepage
1. Visit http://localhost:5173
2. Should see landing page with "Smart Waste Management"
3. Click "Get Started" or "Sign In"

### Test 2: Registration
1. Click "Register"
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
3. Click "Create Account"
4. Should redirect to Dashboard

### Test 3: Login
1. Click "Login"
2. Use demo credentials:
   - **Admin:** admin@wastemanagement.com / admin123
   - **User:** jane@example.com / user123
3. Should redirect to Dashboard

### Test 4: Dashboard
1. After login, should see:
   - Welcome message with your name
   - Statistics cards
   - Recent reports
   - Today's schedules
   - Quick action buttons

### Test 5: Create Report
1. Click "New Report" or "Report an Issue"
2. Fill in the form:
   - Title: "Test Report"
   - Description: "Testing report creation"
   - Category: Select one
   - Priority: Select one
   - Address: Enter address
   - Click "Use Current Location" (allow location permission)
   - Upload 1-2 images
3. Click "Submit Report"
4. Should redirect to Reports page

### Test 6: View Reports
1. Click "Reports" in navbar
2. Should see list of all reports
3. Try filters (Status, Category, Priority)
4. Test pagination

### Test 7: Schedules
1. Click "Schedules" in navbar
2. Should see:
   - Today's collections (if any)
   - Weekly schedule
   - Waste segregation guide
3. Try filtering by area or waste type

### Test 8: Admin Dashboard (Admin only)
1. Login as admin
2. Click "Admin" in navbar
3. Should see:
   - Statistics overview
   - Pie chart (Reports by Category)
   - Bar chart (Reports by Priority)
   - Recent reports table

### Test 9: Logout
1. Click logout icon in navbar
2. Should redirect to homepage
3. Protected routes should redirect to login

---

## 📱 Features Overview

### 🏠 Home Page
- Hero section with SDG 11 badge
- Features showcase
- Statistics
- Call-to-action

### 🔐 Authentication
- User registration with validation
- Login with JWT tokens
- Password confirmation
- Error handling
- Demo credentials display

### 📊 User Dashboard
- Statistics cards (Total, Pending, In Progress, Resolved)
- Recent reports list
- Today's collection schedule
- Quick action buttons
- Loading states

### 📝 Reports Management
- View all reports
- Advanced filtering (Status, Category, Priority, Search)
- Pagination
- Image thumbnails
- Status indicators
- Priority colors

### ➕ Create Report
- Multi-step form
- Image upload (max 5, 5MB each)
- Image preview
- Geolocation support
- Validation
- Success/error messages

### 📅 Schedules
- Today's collections highlight
- Weekly schedule view
- Filter by area and waste type
- Waste segregation guide
- Color-coded waste types

### 👑 Admin Dashboard
- Overview statistics
- Pie chart (Reports by Category)
- Bar chart (Reports by Priority)
- Recent reports table
- Quick action buttons
- User management preview

---

## 🎨 Customization

### Change Primary Color

Edit `tailwind.config.js`:
```javascript
primary: {
  600: '#YOUR_COLOR', // Main color
  700: '#DARKER_SHADE', // Hover color
}
```

### Update Branding

Edit `src/components/Navbar.jsx`:
```javascript
<Trash2 className="h-8 w-8 text-primary-600" />
// Replace with:
<img src="/logo.png" alt="Logo" />
```

### Modify Routes

Edit `src/App.jsx` to add/remove routes:
```javascript
<Route path="/your-route" element={<YourComponent />} />
```

---

## 🚨 Troubleshooting

### Issue: "Cannot GET /api/..."
**Solution:** Backend not running. Start backend server:
```powershell
cd backend
npm run dev
```

### Issue: Blank page after login
**Solution:** Check browser console for errors. Verify:
1. Token in localStorage: `localStorage.getItem('token')`
2. User in localStorage: `localStorage.getItem('user')`

### Issue: Images not uploading
**Solution:** 
1. Check file size (< 5MB)
2. Check file format (JPG, PNG, GIF)
3. Verify Cloudinary credentials in backend .env

### Issue: Tailwind styles not working
**Solution:**
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install

# Restart dev server
npm run dev
```

### Issue: CORS errors
**Solution:** 
1. Check backend CORS is enabled
2. Verify Vite proxy in `vite.config.js`
3. Use same origin (localhost)

---

## 📦 Build for Production

```powershell
# Build
npm run build

# Preview production build
npm run preview

# Output in dist/ folder
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

### Option 2: Netlify

1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy:
```powershell
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Option 3: GitHub Pages

```powershell
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

---

## 📝 Project Structure Summary

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Reports.jsx
│   │   ├── CreateReport.jsx
│   │   ├── Schedules.jsx
│   │   └── AdminDashboard.jsx
│   ├── context/        # React Context
│   │   └── AuthContext.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── package.json        # Dependencies
```

---

## 🎓 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Charts & graphs
- **JWT** - Authentication

---

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)
- [Lucide Icons](https://lucide.dev)

---

## ✨ Next Steps

1. ✅ Test all features thoroughly
2. 🎨 Customize branding and colors
3. 📸 Add more image handling features
4. 🗺️ Integrate Google Maps for location
5. 🔔 Add notifications system
6. 📱 Make it a PWA (Progressive Web App)
7. 🚀 Deploy to production

---

## 🎉 Congratulations!

You now have a complete, production-ready waste management application with:
- Beautiful, responsive UI
- Full authentication system
- Report management with image uploads
- Collection schedules
- Admin dashboard with analytics
- Modern tech stack

**Ready to make cities cleaner and more sustainable! 🌍♻️**