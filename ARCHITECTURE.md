# System Architecture & Workflow

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT SIDE (Frontend)                    │
│                    Next.js + React 18                        │
├─────────────────────────────────────────────────────────────┤
│  Navbar  │  Hero Section  │  Projects List  │  Admin Panel   │
│  Footer  │  Modals        │  Request Form   │  Dashboard     │
└────────────────────────────┬────────────────────────────────┘
                             │
                    Framer Motion (Animations)
                    Zustand (State Management)
                             │
┌────────────────────────────┴────────────────────────────────┐
│               FIREBASE BACKEND                              │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Firebase Authentication                              │   │
│ │ - Email/Password Login                              │   │
│ │ - Google OAuth                                       │   │
│ │ - Role-based access control                          │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Firestore Database                                   │   │
│ │ - Projects Collection                                │   │
│ │ - Requests Collection                                │   │
│ │ - Admin Settings Collection                          │   │
│ │ - Real-time syncing                                  │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Firebase Storage                                     │   │
│ │ - Screenshot uploads                                │   │
│ │ - Secure file management                            │   │
│ │ - CDN delivery                                       │   │
│ └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Collections

#### `projects`
```
Document ID: UUID
├── name: string
├── category: string
├── subcategory: string
├── techStack: array<string>
├── generalPrice: number
├── discountedPrice: number
├── shortDescription: string
├── fullSynopsis: string
├── features: array<string>
├── githubLink: string
├── youtubeLink: string
├── learningResourcesLink: string
├── vivaQuestionsLink: string
├── howToRun: string
├── difficulty: enum<beginner|intermediate|advanced>
├── tags: array<string>
├── views: number
├── requests: number
├── sales: number
├── revenue: number
├── rating: number
├── status: enum<active|inactive>
├── createdAt: timestamp
└── updatedAt: timestamp
```

#### `requests`
```
Document ID: UUID
├── requestId: string (unique)
├── projectId: string (reference to projects)
├── projectName: string
├── userId: string (reference to auth)
├── userName: string
├── email: string
├── phone: string
├── whatsapp: string
├── collegeName: string
├── message: string
├── status: enum<pending|details_sent|screenshot_submitted|approved|rejected>
├── paymentStatus: enum<not_paid|pending_verification|verified>
├── amount: number
├── screenshotUrl: string
├── transactionId: string
├── downloadEnabled: boolean
├── createdAt: timestamp
└── updatedAt: timestamp
```

#### `admin/settings`
```
Document ID: settings
├── whatsappNumber: string
├── email: string
├── upiId: string (masked)
├── bankAccount: string (masked)
├── bankIfsc: string
├── companyName: string
├── youtubeChannelLink: string
├── githubOrgLink: string
└── updatedAt: timestamp
```

---

## 🔄 Complete User Journey

### Phase 1: Discovery
```
User Visits Website
    ↓
Views Home Page (Hero Section, Stats)
    ↓
Clicks "Explore Projects" or navigates to /projects
    ↓
Sees Projects Grid
├─ Can search by name/tech/tags
├─ Can filter by category
└─ Can sort by price/views
    ↓
Clicks "View Details" on project
    ↓
View counter increments (+1)
    ↓
Sees Full Project Details Page
├─ Full synopsis
├─ Features list
├─ Embedded YouTube video
├─ Pricing (original & discounted)
├─ Tech stack badges
└─ "Request This Project" button
```

### Phase 2: Request Submission
```
User Clicks "Request This Project"
    ↓
RequestModal Opens
    ↓
User Fills Form
├─ Full Name
├─ Email
├─ Phone Number
├─ WhatsApp Number
├─ College Name (optional)
└─ Message/Requirements (optional)
    ↓
User Clicks "Submit Request"
    ↓
System Validates Form
    ↓
System Generates Request ID
Format: REQ-YYYY-NNNN
Example: REQ-2026-0042
    ↓
Saves to Firestore:
├─ All user details
├─ Project details
├─ Request ID
├─ Status: "pending"
├─ Payment Status: "not_paid"
└─ Timestamp
    ↓
Project request counter +1
    ↓
User Sees Success Confirmation
├─ "✅ Request Submitted Successfully!"
├─ Displays Request ID
├─ Shows next steps
└─ Displays support contact
```

### Phase 3: Payment Details Sharing (Manual)
```
Admin Receives Notification
(checks /admin → Payment Requests)
    ↓
Admin Searches for Request ID in Dashboard
    ↓
Admin Verifies Details
├─ Check user information
├─ Check project details
├─ Check amount
└─ Verify legitimacy (not spam)
    ↓
Admin Shares Payment Details Manually
├─ Via WhatsApp with QR code
├─ Via Email with bank details
└─ Updates request status: "details_sent"
    ↓
User Receives Notification
├─ WhatsApp: "Here are payment details..."
├─ Email: Same information
├─ Instructions on how to pay
└─ 24-hour validity notice
```

### Phase 4: Payment & Verification
```
User Makes Payment
├─ Opens UPI app
├─ Scans QR code or enters UPI ID
├─ Enters amount: ₹[discountedPrice]
└─ Completes transaction
    ↓
User Takes Screenshot
├─ Shows "Transaction Successful"
├─ Shows amount: ₹[discountedPrice]
├─ Shows date & time
├─ Shows transaction ID
└─ Shows recipient UPI ID
    ↓
User Uploads Screenshot
Option 1: WhatsApp to admin
Option 2: Website → Track Request → Upload
    ↓
Screenshot Saved to Firebase Storage
    ↓
Request Status Updated: "screenshot_submitted"
Payment Status: "pending_verification"
    ↓
Admin Receives Notification
    ↓
Admin Reviews Screenshot in Dashboard
├─ Views full screenshot
├─ Checks amount matches (₹[discountedPrice])
├─ Verifies date/time recent (< 24 hours)
├─ Confirms transaction ID visible
├─ Checks for photoshop/editing signs
├─ Cross-references with own bank account
└─ Can call/WhatsApp user if suspicious
    ↓
Admin Approves Payment
└─ Clicks "Approve" button
    ↓
System Updates Database:
├─ Payment Status: "verified"
├─ Request Status: "approved"
├─ Download Enabled: true
├─ Update Timestamp
├─ Project stats update:
│  ├─ sales +1
│  ├─ revenue +₹[amount]
│  └─ downloads available
└─ Analytics update
```

### Phase 5: Download & Completion
```
User Receives Approval Notification
├─ WhatsApp: "Your payment verified! Download now"
├─ Email: Same with download link
└─ Shows download link: /download/[requestId]
    ↓
User Clicks Download Link
    ↓
System Verifies:
├─ Request ID exists
├─ Payment verified
└─ Download enabled = true
    ↓
User Sees Download Page
├─ Project name and details
├─ "Download Source Code ZIP" button
├─ Links to:
│  ├─ YouTube demo video
│  ├─ Viva questions PDF
│  └─ Learning resources
├─ Full "How to Run" instructions
└─ Support contact information
    ↓
User Clicks "Download Source Code ZIP"
    ↓
Browser Downloads ZIP from GitHub/Storage
    ↓
Download counter +1
    ↓
User Can Access:
├─ Complete source code
├─ Setup instructions
├─ Video tutorials
├─ Learning materials
├─ Viva questions
└─ All resources included
    ↓
User Follows Instructions & Runs Project
    ↓
✅ User Successfully Uses Project
    ↓
(Optional) User Submits Review/Rating
```

---

## 👨‍💼 Admin Workflow

### Daily Tasks
```
Morning Check:
├─ Log into /admin
├─ Check "Payment Requests" section
├─ Find requests with status "pending" or "screenshot_submitted"
└─ Review and verify screenshots

Payment Verification Process:
├─ Check amount: Must match ₹[discountedPrice]
├─ Check date/time: Recent (< 24 hours)
├─ Check transaction details visible
├─ Cross-reference with bank account SMS
└─ Click "Approve" if legitimate
└─ Update request status: "approved"

Send Notifications:
├─ Approved users receive WhatsApp
├─ Approved users receive Email
└─ Download links activated

Respond to Queries:
├─ Answer WhatsApp inquiries
├─ Respond to Emails
└─ Provide support as needed
```

### Weekly Tasks
```
Analytics Review:
├─ Total projects
├─ Total requests
├─ Total sales
├─ Total revenue
├─ Conversion rate
└─ Best performing projects

Project Management:
├─ Add new projects (if ready)
├─ Update project details
├─ Remove inactive projects
└─ Adjust pricing if needed

Performance Optimization:
├─ Check for any errors in logs
├─ Review user feedback
└─ Plan improvements
```

### Monthly Tasks
```
Comprehensive Analysis:
├─ Revenue trends
├─ Sales patterns
├─ User demographics
└─ Popular tech stacks

Strategic Planning:
├─ Plan new projects based on demand
├─ Identify underperforming projects
├─ Plan marketing campaigns
└─ Set goals for next month

Backup & Security:
├─ Export all data
├─ Verify backups
└─ Update security settings
```

---

## 📈 Analytics Dashboard

### Real-time Metrics
```
Today's Summary:
├─ New Requests: [number]
├─ Pending Verifications: [number]
├─ Approved Today: [number]
├─ Revenue Today: ₹[amount]
└─ Downloads Today: [number]

Overall Statistics:
├─ Total Projects: [number]
├─ Total Requests: [number]
├─ Total Sales: [number]
├─ Total Revenue: ₹[amount]
├─ Conversion Rate: [%]
├─ Average Order Value: ₹[amount]
└─ Active Users: [number]

Project Performance:
├─ Top Projects by Views
├─ Top Projects by Revenue
├─ Top Projects by Sales
├─ Trending Projects
└─ Conversion Rate per Project

User Activity:
├─ Recent Requests Log
├─ Payment Approvals
├─ Downloads Tracking
└─ User Demographics
```

---

## 🔐 Security Measures

### Authentication
```
User Login Flow:
┌─────────────────────────────┐
│  Email/Password Login       │ → Firebase Auth → Session
│  Google OAuth Login         │ → Firebase Auth → Session
└─────────────────────────────┘

Admin Verification:
├─ Email must contain "admin"
├─ User must be in Firebase Auth
└─ Access control enforced at routes
```

### Data Protection
```
Firestore Security Rules:
├─ Projects: Public read, admin write
├─ Requests: User can read own, admin can read all
├─ Settings: Admin only access
└─ Storage: Admin only access

Encryption:
├─ Firebase handles all data encryption
├─ HTTPS enforced
├─ SSL certificate
└─ Secure tokens
```

### Payment Security
```
Manual Verification Process:
├─ No automated payment collection
├─ Admin manually verifies screenshots
├─ Transaction ID cross-checking
├─ Amount verification
├─ Screenshot authentication
└─ Call verification for suspicious cases

Private Bank Details:
├─ NOT stored in database
├─ Shared manually via WhatsApp
├─ Separate business account
├─ Regular monitoring
└─ Fraud detection
```

---

## 🚀 Deployment Pipeline

```
Local Development
    ↓
Code pushed to GitHub
    ↓
Netlify detects commit
    ↓
Automated Build Process
├─ npm install
├─ npm run build
├─ Generate .next folder
└─ Run tests (optional)
    ↓
Deploy to Netlify CDN
├─ Global edge locations
├─ Automatic caching
├─ SSL certificate
└─ Custom domain
    ↓
Site Goes Live
├─ Updated automatically
├─ Zero downtime deployment
├─ Instant rollback if needed
└─ Production ready
```

---

## 🔄 Integration Points

### External Services
```
Firebase Services:
├─ Authentication (Login/Signup)
├─ Firestore (Database)
├─ Storage (File uploads)
└─ Hosting (Alternative deployment)

Third-party Integrations:
├─ GitHub (Project files)
├─ YouTube (Demo videos)
├─ Google Drive (Resources)
├─ UPI Payment Apps (User payment)
└─ Email (Notifications)

Netlify:
├─ Hosting
├─ CI/CD pipeline
├─ Domain management
└─ Analytics
```

---

## 📱 Component Architecture

```
App (_app.tsx)
│
├─── Navbar (fixed)
│    ├─ Logo/Brand
│    ├─ Navigation links
│    ├─ Search
│    └─ Auth buttons
│
├─── Main Content
│    ├─ Home Page (/)
│    │  ├─ HeroSection
│    │  ├─ Stats
│    │  └─ Features
│    │
│    ├─ Projects (/projects)
│    │  ├─ Search/Filter
│    │  ├─ ProjectGrid
│    │  └─ RequestModal
│    │
│    ├─ Track (/track)
│    │  ├─ SearchForm
│    │  └─ RequestDetails
│    │
│    ├─ Login (/login)
│    │  ├─ EmailForm
│    │  └─ GoogleButton
│    │
│    └─ Admin (/admin)
│       ├─ Dashboard
│       ├─ Tabs
│       └─ Tables/Charts
│
└─── Footer (fixed)
     ├─ Links
     ├─ Contact
     └─ Social
```

---

## 🎨 State Management (Zustand)

```
Stores:
├─ authStore
│  ├─ user: User | null
│  ├─ loading: boolean
│  ├─ setUser()
│  └─ setLoading()
│
├─ projectStore
│  ├─ projects: Project[]
│  ├─ setProjects()
│  ├─ addProject()
│  └─ updateProject()
│
├─ requestStore
│  ├─ requests: Request[]
│  ├─ setRequests()
│  ├─ addRequest()
│  └─ updateRequest()
│
└─ settingsStore
   ├─ settings: AdminSettings | null
   └─ setSettings()
```

---

## 📊 Key Metrics

### Business Metrics
```
Revenue:
├─ Total Revenue: ₹X
├─ Average Order Value: ₹Y
├─ Revenue per project: ₹Z
└─ Monthly growth: %

Sales:
├─ Total Sales: N
├─ Sales per project: M
├─ Conversion Rate: %
└─ Monthly sales: N

Engagement:
├─ Total Views: V
├─ Total Requests: R
├─ Request/View ratio: %
└─ Downloads: D
```

### Performance Metrics
```
Site Performance:
├─ Page load time: <3s
├─ Time to interactive: <5s
├─ Mobile performance: >90
└─ SEO score: >90

Database:
├─ Read operations
├─ Write operations
├─ Storage usage
└─ Firestore quota
```

---

This complete architecture ensures:
✅ Scalability
✅ Security
✅ Performance
✅ User Experience
✅ Admin Control
✅ Automatic Analytics
