# Projects Ready 4 You

A complete platform for selling production-ready projects with integrated payment system, admin dashboard, and user tracking.

## Features

### For Users
- 🎨 Beautiful, responsive UI with Cyber Neon theme
- 🔍 Browse and search projects by category, tech stack, and tags
- 📥 Request projects with simple form submission
- 💳 Secure payment tracking system
- 📱 Track request status with real-time updates
- 📥 Download project files, videos, and resources
- ⭐ Rate and review projects

### For Admin
- 📊 Comprehensive analytics dashboard
- 👥 Manage payment requests and verifications
- 📦 Add and manage projects
- ⚙️ Configure business settings (WhatsApp, email, UPI, bank details)
- 📈 Track revenue, sales, and conversion rates
- 📋 View detailed request history and user analytics

### Security Features
- 🔐 Manual payment verification process
- 🔑 Admin-only access with Google/Email authentication
- 🏦 Separate business bank account integration
- 📸 Screenshot verification with transaction ID cross-checking
- 🔒 Secure file storage with Firebase

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom Cyber Neon theme
- **Animations**: Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: Zustand
- **Deployment**: Netlify / Vercel
- **Icons**: React Icons

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd projects-ready-4-you
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── components/
│   ├── Navbar.tsx           # Navigation component
│   ├── Footer.tsx           # Footer component
│   ├── HeroSection.tsx       # Home page hero
│   └── RequestModal.tsx      # Project request modal
├── pages/
│   ├── _app.tsx            # App wrapper
│   ├── index.tsx           # Home page
│   ├── projects.tsx        # Projects listing
│   ├── track.tsx           # Track request page
│   ├── login.tsx           # Admin login
│   └── admin/
│       └── index.tsx       # Admin dashboard
├── lib/
│   ├── firebase.ts         # Firebase config
│   ├── db.ts              # Database operations
│   └── store.ts           # Zustand stores
├── styles/
│   └── globals.css        # Global styles
└── public/
```

## Color Scheme (Cyber Neon)

- **Background Dark**: #0b0e27
- **Card Background**: #151a36
- **Neon Green**: #02fe88
- **Neon Cyan**: #00d9ff
- **Text White**: #ffffff
- **Text Light**: #b8c5d6

## Deployment on Netlify

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically on git push

```bash
npm run build
```

## Database Schema

### Collections

**projects**
- id: string
- name: string
- category: string
- techStack: string[]
- generalPrice: number
- discountedPrice: number
- views: number
- requests: number
- sales: number
- revenue: number
- status: 'active' | 'inactive'

**requests**
- id: string
- projectId: string
- requestId: string (unique)
- userName: string
- email: string
- phone: string
- whatsapp: string
- status: 'pending' | 'details_sent' | 'screenshot_submitted' | 'approved' | 'rejected'
- paymentStatus: 'not_paid' | 'pending_verification' | 'verified'
- screenshotUrl: string (optional)
- transactionId: string (optional)
- downloadEnabled: boolean

**admin**
- settings document containing business configuration

## Environment Variables

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_FIREBASE_API_KEY | Firebase API key |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Firebase auth domain |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Firebase project ID |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | Firebase storage bucket |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | Firebase messaging sender ID |
| NEXT_PUBLIC_FIREBASE_APP_ID | Firebase app ID |

## Workflow

1. **Admin Setup**: Create business accounts and configure settings
2. **Add Projects**: Admin adds projects with all details, links, and pricing
3. **User Discovers**: Users browse and search projects
4. **User Requests**: Users fill request form and submit
5. **Payment Details**: Admin manually shares payment details via WhatsApp/Email
6. **Payment**: User makes payment and uploads screenshot
7. **Verification**: Admin verifies payment details
8. **Download**: User gets download link and downloads files
9. **Analytics**: All metrics automatically tracked

## Support

For support:
- 📱 WhatsApp: +91 98765 43210
- 📧 Email: support@projects4you.com

## License

MIT License - feel free to use this for your projects!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for students and developers
