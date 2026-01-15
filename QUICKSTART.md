# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Clone & Install (2 min)
```bash
git clone <your-repo>
cd projects-ready-4-you
npm install
```

### Step 2: Configure Firebase (2 min)
1. Create `.env.local` file
2. Copy your Firebase config from Firebase Console
3. Paste credentials into `.env.local`

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 3: Run Locally (1 min)
```bash
npm run dev
```
Open http://localhost:3000

---

## 📋 Essential Commands

```bash
# Development
npm run dev           # Start dev server

# Production
npm run build         # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 🔐 Create Admin Account

1. Go to Firebase Console → Authentication
2. Create user with email containing "admin"
3. Example: `admin@yoursite.com`
4. Log in at `/login`
5. Access admin panel at `/admin`

---

## 📁 Project Structure Overview

```
src/
├── pages/              # All routes and pages
│   ├── index.tsx      # Homepage
│   ├── projects.tsx   # Project listing
│   ├── track.tsx      # Request tracking
│   ├── login.tsx      # Admin login
│   └── admin/         # Admin dashboard
├── components/         # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   └── RequestModal.tsx
├── lib/               # Backend logic
│   ├── firebase.ts    # Firebase config
│   ├── db.ts         # Database operations
│   └── store.ts      # State management
└── styles/
    └── globals.css   # Tailwind + custom styles
```

---

## 🎨 Customizing Colors

Edit `styles/globals.css` to change the Cyber Neon theme:

```css
:root {
  --bg-dark: #0b0e27;
  --bg-card: #151a36;
  --neon-green: #02fe88;
  --neon-cyan: #00d9ff;
  --text-white: #ffffff;
  --text-light: #b8c5d6;
}
```

---

## 🌐 Deploy to Netlify

1. Push code to GitHub
2. Connect GitHub to Netlify
3. Add environment variables
4. Click Deploy
5. Done! ✅

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `.next`

---

## 📊 Database Structure

### Projects Collection
```javascript
{
  id: "unique_id",
  name: "E-commerce Website",
  category: "Web Development",
  techStack: ["React", "Node.js", "MongoDB"],
  generalPrice: 1000,
  discountedPrice: 699,
  views: 150,
  requests: 25,
  sales: 18,
  revenue: 12582,
  status: "active"
}
```

### Requests Collection
```javascript
{
  id: "unique_id",
  requestId: "REQ-2026-0001",
  projectId: "project_id",
  userName: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
  whatsapp: "9876543210",
  status: "pending", // or approved
  paymentStatus: "not_paid", // or verified
  amount: 699,
  screenshotUrl: "firebase_url",
  transactionId: "TXN123456789",
  downloadEnabled: false
}
```

---

## 🔧 Common Tasks

### Add a New Project
1. Log in as admin
2. Go to Admin → Add Project
3. Fill all fields
4. Click Submit
5. Project appears immediately on site

### Verify Payment
1. Go to Admin → Payment Requests
2. Find pending request
3. Review screenshot
4. Click Approve
5. User gets download link

### Track Analytics
1. Go to Admin → Dashboard
2. View real-time metrics:
   - Total Revenue
   - Total Sales
   - Conversion Rate
   - Recent Requests

### Update Project
1. Go to Admin → Projects
2. Click project
3. Edit details
4. Save changes

---

## 🆘 Troubleshooting

### Firebase Not Connecting
- Check `.env.local` file exists
- Verify credentials are correct
- Restart dev server: `npm run dev`

### Admin Panel 404
- Email must contain "admin"
- User must be created in Firebase
- Clear browser cache

### Build Fails
```bash
# Clean and rebuild
rm -rf node_modules .next
npm install
npm run build
```

### Styles Not Loading
- Check `postcss.config.js` exists
- Clear `.next` folder
- Restart dev server

---

## 📱 Features at a Glance

### For Users
✅ Browse projects
✅ Search & filter  
✅ Request projects
✅ Track requests
✅ Download files
✅ Rate projects

### For Admin
✅ Manage projects
✅ View analytics
✅ Verify payments
✅ Track requests
✅ Configure settings
✅ Export reports

---

## 🚢 Deployment Checklist

- [ ] Firebase project created
- [ ] Environment variables set
- [ ] Admin account created
- [ ] At least 5 projects added
- [ ] GitHub repository created
- [ ] Netlify connected
- [ ] Domain configured (optional)
- [ ] SSL enabled
- [ ] Custom email set up

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

---

## 💡 Tips & Best Practices

1. **Security**: Never share Firebase credentials
2. **Performance**: Compress project images
3. **SEO**: Add meta tags to pages
4. **Mobile**: Test on mobile devices
5. **Backups**: Regular Firebase exports
6. **Updates**: Keep dependencies updated

---

## 🎯 Next Steps

1. ✅ Get it running locally
2. ✅ Customize colors & text
3. ✅ Set up Firebase
4. ✅ Create admin account
5. ✅ Add sample projects
6. ✅ Test complete flow
7. ✅ Deploy to Netlify
8. ✅ Launch! 🎉

---

**Happy Coding! 🚀**

Questions? Check the docs or open an issue on GitHub.
