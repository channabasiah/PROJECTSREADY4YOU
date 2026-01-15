# Deployment Guide - Projects Ready 4 You

## Prerequisites
- GitHub account
- Netlify or Vercel account
- Firebase project
- Node.js 16+ installed locally

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `projects-ready-4-you`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication
1. In Firebase console, go to Authentication
2. Click "Get Started"
3. Enable "Email/Password" authentication
4. Enable "Google" authentication
5. Add your domain to authorized domains

### 1.3 Enable Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Select region (closest to your users)

### 1.4 Enable Storage
1. Go to Storage
2. Click "Get Started"
3. Keep default rules for now

### 1.5 Get Firebase Credentials
1. Go to Project Settings (gear icon)
2. Click "Your apps" section
3. Create a web app (if not exists)
4. Copy the Firebase config object
5. The keys you need:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

## Step 2: Local Setup

### 2.1 Clone Repository
```bash
git clone https://github.com/yourusername/projects-ready-4-you.git
cd projects-ready-4-you
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Configure Environment
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2.4 Test Locally
```bash
npm run dev
```
Visit http://localhost:3000

## Step 3: Firebase Security Rules

### 3.1 Firestore Rules
Go to Firestore Database → Rules and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /projects/{document=**} {
      allow read;
      allow write: if request.auth != null && request.auth.token.email.matches('.*@admin.*');
    }
    
    // Admin only
    match /admin/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.email.matches('.*@admin.*');
    }
    
    // Requests
    match /requests/{document=**} {
      allow read: if request.auth != null && request.auth.token.email.matches('.*@admin.*');
      allow create;
      allow update: if resource.data.email == request.auth.token.email;
    }
  }
}
```

### 3.2 Storage Rules
Go to Storage → Rules and paste:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null && request.auth.token.email.matches('.*@admin.*');
      allow write: if request.auth != null && request.auth.token.email.matches('.*@admin.*');
    }
  }
}
```

## Step 4: Prepare for Deployment

### 4.1 Build the Project
```bash
npm run build
```

### 4.2 Create GitHub Repository
1. Initialize git (if not already):
```bash
git init
git add .
git commit -m "Initial commit: Projects Ready 4 You platform"
```

2. Create repository on GitHub
3. Push code:
```bash
git remote add origin https://github.com/yourusername/projects-ready-4-you.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy on Netlify

### 5.1 Connect Repository
1. Go to [Netlify](https://www.netlify.com/)
2. Click "New site from Git"
3. Choose GitHub
4. Authorize Netlify
5. Select `projects-ready-4-you` repository

### 5.2 Configure Build Settings
- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `.next`

### 5.3 Add Environment Variables
1. Go to Site settings → Build & deploy → Environment
2. Add all your Firebase credentials:
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID

### 5.4 Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be live at a Netlify URL

### 5.5 Custom Domain (Optional)
1. Go to Domain settings
2. Click "Add domain"
3. Enter your custom domain
4. Update DNS records as instructed

## Step 6: Post-Deployment Setup

### 6.1 Create Admin Account
1. In Firebase Authentication, create user with:
   - Email: `admin@yourdomain.com` (must contain "admin")
   - Password: Strong password
2. This user can access `/admin` panel

### 6.2 Initialize Admin Settings
1. Log in to admin panel
2. Go to Settings
3. Enter:
   - WhatsApp Number
   - Email Address
   - UPI ID
   - Bank Account Details
   - Company Name

### 6.3 Add First Projects
1. Go to Admin → Add Project
2. Fill in all project details
3. Submit to add to database

### 6.4 Test Complete Flow
1. Visit your website
2. Browse projects
3. Submit a test request
4. Check admin panel for request
5. Track request status

## Step 7: Continuous Deployment

### 7.1 Auto-Deploy on Git Push
Netlify will automatically:
- Detect commits to `main` branch
- Run build
- Deploy new version
- No manual steps needed!

### 7.2 Rollback (if needed)
1. Go to Deployments
2. Click on previous successful deployment
3. Click "Restore" to rollback

## Step 8: Monitoring & Maintenance

### 8.1 Monitor Performance
1. Netlify Analytics → Bandwidth, Requests
2. Firebase Analytics → User activity
3. Check logs for errors

### 8.2 Regular Tasks
- **Daily**: Check admin panel for new requests
- **Weekly**: Verify analytics, process payments
- **Monthly**: Update projects, analyze trends

### 8.3 Backup
- Firebase automatically backs up data
- Git repository serves as code backup
- Export requests/projects regularly for safety

## Troubleshooting

### Issue: 404 errors after deployment
**Solution**: Ensure `.next` folder is published directory, not `out`

### Issue: Firebase credentials not working
**Solution**: 
- Verify credentials are correct
- Check Firebase project is active
- Ensure domain is authorized in Firebase

### Issue: Admin panel not loading
**Solution**:
- Check if email contains "admin"
- Verify user is created in Firebase
- Check browser console for errors

### Issue: Slow deployment
**Solution**:
- Clear `node_modules` and reinstall
- Check build logs for warnings
- Optimize images and assets

## Production Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Security rules configured
- [ ] Environment variables set
- [ ] Admin account created
- [ ] Admin settings configured
- [ ] At least 5 projects added
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics set up
- [ ] Support contact info added

## Support

For deployment help:
- Check Netlify build logs
- Review Firebase documentation
- Check Next.js deployment guide
- Contact support team

---

**Your site is now LIVE! 🎉**

Start adding projects and accepting requests!
