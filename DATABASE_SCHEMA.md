# Firebase Database Schema - Payment System

## 📊 Complete Database Structure

### **Collection: `requests`**

This collection stores all user payment requests.

```javascript
Collection: requests
├─ Document: auto-generated-uuid-1
│  ├─ requestId: "REQ-2026-0042"              (string)
│  ├─ projectId: "Gx7k2mN9p0q1"              (string) - Link to projects
│  ├─ projectName: "React Dashboard"         (string)
│  ├─ amount: 500                            (number) - Price in ₹
│  │
│  ├─ userName: "John Doe"                   (string)
│  ├─ email: "john@email.com"               (string)
│  ├─ phone: "9876543210"                   (string)
│  ├─ whatsapp: "9876543210"                (string)
│  ├─ collegeName: "MIT"                    (string) - Optional
│  ├─ message: "Need deployment help"      (string) - Optional
│  │
│  ├─ status: "pending"                     (string)
│  │  └─ Values: pending, details_sent, approved, rejected
│  │
│  ├─ paymentStatus: "verified"             (string) - CRITICAL FIELD
│  │  └─ Values:
│  │     • "not_paid" (initial)
│  │     • "pending_verification" (screenshot received)
│  │     • "verified" (approved by admin) ✅
│  │     • "rejected" (payment invalid)
│  │
│  ├─ downloadEnabled: true                 (boolean) - CRITICAL FIELD
│  │  └─ true = User can download
│  │  └─ false = Download not available
│  │
│  ├─ transactionId: "UPI000123456789"     (string) - Admin enters this
│  ├─ verifiedAt: "2026-01-15T14:30:00Z"  (timestamp) - Auto-set on approve
│  ├─ rejectedAt: null                     (timestamp) - Auto-set on reject
│  │
│  ├─ createdAt: "2026-01-15T14:00:00Z"   (timestamp) - Auto-created
│  └─ updatedAt: "2026-01-15T14:30:00Z"   (timestamp) - Auto-updated
│
├─ Document: auto-generated-uuid-2
│  ├─ requestId: "REQ-2026-0043"
│  ├─ projectId: "Ab3m8pQ2x5y9"
│  ├─ projectName: "Node.js API"
│  ├─ amount: 300
│  ├─ userName: "Jane Smith"
│  ├─ email: "jane@email.com"
│  ├─ phone: "9876543211"
│  ├─ whatsapp: "9876543211"
│  ├─ paymentStatus: "not_paid"
│  ├─ downloadEnabled: false
│  ├─ transactionId: null
│  └─ ...
│
└─ Document: auto-generated-uuid-3
   ├─ requestId: "REQ-2026-0044"
   └─ ...
```

---

### **Collection: `projects`**

This collection stores all products you're selling.

```javascript
Collection: projects
├─ Document: auto-generated-uuid-1
│  ├─ name: "React Dashboard"               (string)
│  ├─ category: "Web Development"           (string)
│  ├─ subcategory: "Admin Panel"           (string)
│  ├─ shortDescription: "Modern admin..."  (string)
│  ├─ description: "Full-featured..."      (string)
│  │
│  ├─ generalPrice: 999                     (number) - Original price
│  ├─ discountedPrice: 500                  (number) - Discounted price
│  │
│  ├─ techStack: ["React", "Node.js", "MongoDB"]  (array)
│  ├─ tags: ["dashboard", "admin", "responsive"]  (array)
│  ├─ features: ["Auth", "Charts", "DB"]   (array)
│  │
│  ├─ githubUrl: "https://github.com/..."  (string)
│  ├─ youtubeUrl: "https://youtube.com/.."  (string)
│  ├─ learningResources: "https://docs..."  (string)
│  ├─ vivaQuestions: "https://notion..."    (string)
│  │
│  ├─ setupInstructions: "npm install..."  (string)
│  ├─ difficulty: "Intermediate"           (string)
│  │
│  ├─ views: 150                           (number) - Auto-incremented
│  ├─ requests: 12                         (number) - Auto-incremented
│  ├─ sales: 8                             (number) - When payment verified
│  ├─ revenue: 4000                        (number) - Sum of sales
│  ├─ rating: 4.5                          (number) - Future feature
│  │
│  ├─ status: "active"                     (string)
│  ├─ createdAt: "2026-01-10T10:00:00Z"  (timestamp)
│  └─ updatedAt: "2026-01-15T10:00:00Z"  (timestamp)
│
└─ Document: auto-generated-uuid-2
   ├─ name: "Node.js API"
   └─ ...
```

---

### **Collection: `admin`**

Configuration data for admin settings.

```javascript
Collection: admin
└─ Document: settings
   ├─ companyName: "Projects Ready 4 You"        (string)
   ├─ adminEmail: "admin@yoursite.com"          (string)
   ├─ adminPhone: "9876543210"                  (string)
   ├─ adminWhatsApp: "919876543210"             (string)
   │
   ├─ paymentMethods: {
   │  ├─ upi: "admin@upi"
   │  ├─ bank: "HDFC Bank, Account XXXXXX"
   │  ├─ paypal: "admin@email.com"
   │  └─ stripe: "pk_live_XXXXX"
   │ }
   │
   ├─ defaultPrice: 500                         (number)
   ├─ discountPercentage: 40                    (number)
   │
   ├─ autoDownloadLink: "https://drive.google.com/.."  (string)
   ├─ supportEmail: "support@yoursite.com"     (string)
   ├─ supportPhone: "9876543210"                (string)
   │
   └─ updatedAt: "2026-01-15T10:00:00Z"       (timestamp)
```

---

## 🔄 Payment Status Flow (Database Update)

### **Step 1: User Submits Request**

**Database Action:**
```javascript
// addRequest() adds new document:
{
  requestId: "REQ-2026-0042",        // Generated
  projectId: "Gx7k2mN9p0q1",        // From form
  projectName: "React Dashboard",     // From form
  amount: 500,                        // From project price
  userName: "John Doe",               // From form
  email: "john@email.com",           // From form
  phone: "9876543210",               // From form
  whatsapp: "9876543210",            // From form
  collegeName: "MIT",                 // From form
  message: "Need deployment help",   // From form
  status: "pending",                 // Initial
  paymentStatus: "not_paid",         // Initial 🔴
  downloadEnabled: false,             // Initial 🔴
  transactionId: null,               // Not set yet
  verifiedAt: null,                  // Not set yet
  createdAt: "2026-01-15T14:00:00Z",  // Auto
  updatedAt: "2026-01-15T14:00:00Z",  // Auto
}

// Also updates project:
updateProjectStats(projectId, 'requests', 1)
// projects.requests: 11 → 12
```

---

### **Step 2: Admin Verifies Payment**

**Database Action:**
```javascript
// updateRequest(docId, updates) updates the document:
{
  paymentStatus: "verified",           // Changed 🟢
  downloadEnabled: true,               // Changed 🟢
  transactionId: "UPI000123456789",   // Admin enters this
  verifiedAt: "2026-01-15T14:30:00Z", // Auto-timestamp
  updatedAt: "2026-01-15T14:30:00Z",  // Auto-update time
}

// Also updates project stats:
// projects.sales: 7 → 8
// projects.revenue: 3500 → 4000
```

---

### **Step 3: User Checks Status**

**Database Query:**
```javascript
// getRequestByRequestId("REQ-2026-0042") retrieves:
{
  id: "auto-uuid",
  requestId: "REQ-2026-0042",
  projectName: "React Dashboard",
  amount: 500,
  userName: "John Doe",
  email: "john@email.com",
  phone: "9876543210",
  whatsapp: "9876543210",
  collegeName: "MIT",
  message: "Need deployment help",
  status: "pending",
  paymentStatus: "verified",         // Shows ✅ Verified
  downloadEnabled: true,             // Download available ✅
  transactionId: "UPI000123456789",  // Shows in UI
  verifiedAt: "2026-01-15T14:30:00Z",
  createdAt: "2026-01-15T14:00:00Z",
  updatedAt: "2026-01-15T14:30:00Z",
}

// Track page displays:
// "Payment Status: VERIFIED ✅"
// "Transaction ID: UPI000123456789"
// "Download Enabled: YES ✅"
// [📥 Download Project Files]
```

---

## 🔐 Firestore Security Rules

These rules prevent unauthorized access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Projects: Public read, admin write
    match /projects/{document=**} {
      allow read;
      allow write: if request.auth != null && 
                      request.auth.token.email.matches('.*admin.*');
    }
    
    // Requests: Users create, admin reads, users update own
    match /requests/{document=**} {
      allow read: if request.auth != null && 
                     request.auth.token.email.matches('.*admin.*');
      allow create;
      allow update: if resource.data.email == request.auth.token.email;
    }
    
    // Admin settings: Admin only
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
                            request.auth.token.email.matches('.*admin.*');
    }
  }
}
```

---

## 📊 Useful Database Queries

### **Query 1: Get All Pending Payments**
```javascript
// Find all requests waiting for payment
const q = query(
  collection(db, 'requests'),
  where('paymentStatus', '==', 'not_paid'),
  orderBy('createdAt', 'desc')
);
```

### **Query 2: Get Verified Payments (Sales)**
```javascript
// Find all successful transactions
const q = query(
  collection(db, 'requests'),
  where('paymentStatus', '==', 'verified'),
  orderBy('verifiedAt', 'desc')
);
```

### **Query 3: Calculate Total Revenue**
```javascript
// Sum all verified payments
const querySnapshot = await getDocs(
  query(collection(db, 'requests'), 
    where('paymentStatus', '==', 'verified')
  )
);

let totalRevenue = 0;
querySnapshot.forEach(doc => {
  totalRevenue += doc.data().amount || 0;
});
```

### **Query 4: Find Request by Request ID**
```javascript
// Used in /track page
const q = query(
  collection(db, 'requests'),
  where('requestId', '==', 'REQ-2026-0042')
);
```

### **Query 5: Get User's Requests**
```javascript
// Find all requests by specific user
const q = query(
  collection(db, 'requests'),
  where('email', '==', 'john@email.com'),
  orderBy('createdAt', 'desc')
);
```

---

## 🎯 Analytics Calculations

### **Total Revenue**
```javascript
getAnalytics() {
  let totalRevenue = 0;
  
  requests.forEach(req => {
    if (req.paymentStatus === 'verified') {
      totalRevenue += req.amount;
    }
  });
  
  return totalRevenue;
}
```

### **Total Sales**
```javascript
let totalSales = 0;

requests.forEach(req => {
  if (req.paymentStatus === 'verified') {
    totalSales += 1;
  }
});
```

### **Conversion Rate**
```javascript
let conversionRate = 0;

const totalRequests = requests.length;
const verifiedRequests = requests.filter(
  r => r.paymentStatus === 'verified'
).length;

if (totalRequests > 0) {
  conversionRate = ((verifiedRequests / totalRequests) * 100).toFixed(2);
}

// Example: 40 requests, 16 verified = 40% conversion
```

---

## 🔍 Data Validation Rules

### **Valid Request Data**
```javascript
{
  // Required fields (must exist)
  requestId: string (REQ-YYYY-NNNN format),
  projectId: string (non-empty),
  projectName: string (non-empty),
  amount: number (positive, > 0),
  userName: string (non-empty),
  email: string (valid email format),
  phone: string (10 digits),
  whatsapp: string (10 digits),
  status: string (one of: pending, details_sent, approved, rejected),
  paymentStatus: string (one of: not_paid, pending_verification, verified, rejected),
  downloadEnabled: boolean (true/false),
  
  // Optional fields
  collegeName: string (optional),
  message: string (optional),
  transactionId: string (only after admin approval),
  verifiedAt: timestamp (only after admin approval),
  rejectedAt: timestamp (only after rejection),
}
```

---

## 📈 Example Queries for Admin Dashboard

### **Dashboard Stats**
```javascript
// Get all metrics for dashboard
const projects = await getProjects();
const requests = await getRequests();

const stats = {
  totalProjects: projects.length,
  totalRequests: requests.length,
  totalSales: requests.filter(r => r.paymentStatus === 'verified').length,
  totalRevenue: requests
    .filter(r => r.paymentStatus === 'verified')
    .reduce((sum, r) => sum + r.amount, 0),
  conversionRate: ((
    requests.filter(r => r.paymentStatus === 'verified').length / 
    requests.length
  ) * 100).toFixed(2),
  pendingPayments: requests.filter(r => r.paymentStatus === 'not_paid'),
  verifiedPayments: requests.filter(r => r.paymentStatus === 'verified'),
};
```

---

## 💾 Backup & Data Export

### **Export All Requests to CSV**
```javascript
function exportRequestsToCSV() {
  let csv = 'RequestID,User,Email,Amount,Status,Transaction ID\n';
  
  requests.forEach(req => {
    csv += `${req.requestId},${req.userName},${req.email},${req.amount},${req.paymentStatus},${req.transactionId || 'N/A'}\n`;
  });
  
  // Download as CSV
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'requests_export.csv');
  element.click();
}
```

---

## 🚀 Ready to Use

Your database is now set up to:

✅ Store user requests
✅ Track payment status
✅ Record transaction IDs
✅ Calculate analytics
✅ Enable secure downloads

**No Cloud Storage billing needed!** 🎉
