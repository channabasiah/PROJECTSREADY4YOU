# 📚 API & Functions Reference

## Database Functions (lib/db.ts)

### Projects Operations

#### `addProject(projectData: any): Promise<string>`
Adds a new project to the database.

**Parameters:**
```javascript
{
  name: "E-commerce Website",
  category: "Web Development",
  subcategory: "Full Stack",
  techStack: ["React", "Node.js", "MongoDB"],
  generalPrice: 1000,
  discountedPrice: 699,
  shortDescription: "MERN stack e-commerce",
  fullSynopsis: "Detailed description...",
  features: ["Authentication", "Payment", "Cart"],
  githubLink: "https://github.com/...",
  youtubeLink: "https://youtube.com/...",
  learningResourcesLink: "https://drive.google.com/...",
  vivaQuestionsLink: "https://drive.google.com/...",
  howToRun: "Prerequisites... Steps...",
  difficulty: "intermediate",
  tags: ["ecommerce", "payment"]
}
```

**Returns:** `Promise<string>` - Document ID

**Usage:**
```typescript
const projectId = await addProject(projectData);
```

---

#### `getProjects(filters?: {category?: string; techStack?: string[]}): Promise<Project[]>`
Retrieves all projects with optional filtering.

**Parameters:**
```javascript
{
  category: "Web Development", // Optional
  techStack: ["React"] // Optional
}
```

**Returns:** `Promise<Project[]>` - Array of projects

**Usage:**
```typescript
const projects = await getProjects();
// or
const filteredProjects = await getProjects({ category: "Web Development" });
```

---

#### `getProjectById(id: string): Promise<Project | null>`
Retrieves a specific project by ID.

**Parameters:**
- `id: string` - Project document ID

**Returns:** `Promise<Project | null>`

**Usage:**
```typescript
const project = await getProjectById("project-id-123");
```

---

#### `updateProject(id: string, updates: any): Promise<void>`
Updates a project with new data.

**Parameters:**
- `id: string` - Project ID
- `updates: any` - Fields to update

**Usage:**
```typescript
await updateProject("project-id", {
  name: "Updated Name",
  discountedPrice: 599
});
```

---

#### `incrementProjectViews(projectId: string): Promise<void>`
Increments the view count for a project.

**Parameters:**
- `projectId: string` - Project ID

**Usage:**
```typescript
await incrementProjectViews("project-id");
```

---

#### `updateProjectStats(projectId: string, field: string, increment: number): Promise<void>`
Updates project statistics (requests, sales, revenue, etc.)

**Parameters:**
- `projectId: string` - Project ID
- `field: string` - Field name (requests, sales, revenue, etc.)
- `increment: number` - Amount to increment by

**Usage:**
```typescript
// Add 1 to requests
await updateProjectStats("project-id", "requests", 1);

// Add revenue
await updateProjectStats("project-id", "revenue", 699);
```

---

### Request Operations

#### `addRequest(requestData: any): Promise<string>`
Creates a new project request.

**Parameters:**
```javascript
{
  projectId: "project-123",
  projectName: "E-commerce Website",
  userName: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
  whatsapp: "9876543210",
  collegeName: "ABC College",
  message: "Optional message",
  requestId: "REQ-2026-0001",
  status: "pending",
  paymentStatus: "not_paid",
  amount: 699
}
```

**Returns:** `Promise<string>` - Request document ID

**Usage:**
```typescript
const requestId = await addRequest(requestData);
```

---

#### `getRequests(filters?: {status?: string; userId?: string}): Promise<Request[]>`
Retrieves requests with optional filtering.

**Parameters:**
```javascript
{
  status: "pending", // Optional
  userId: "user-id" // Optional
}
```

**Returns:** `Promise<Request[]>`

**Usage:**
```typescript
// Get all pending requests
const pendingRequests = await getRequests({ status: "pending" });

// Get user's requests
const userRequests = await getRequests({ userId: "user-123" });
```

---

#### `getRequestById(id: string): Promise<Request | null>`
Retrieves a specific request by document ID.

**Parameters:**
- `id: string` - Request document ID

**Returns:** `Promise<Request | null>`

**Usage:**
```typescript
const request = await getRequestById("request-id");
```

---

#### `getRequestByRequestId(requestId: string): Promise<Request | null>`
Retrieves a request by the custom Request ID (REQ-YYYY-NNNN format).

**Parameters:**
- `requestId: string` - Request ID (e.g., "REQ-2026-0001")

**Returns:** `Promise<Request | null>`

**Usage:**
```typescript
const request = await getRequestByRequestId("REQ-2026-0001");
```

---

#### `updateRequest(id: string, updates: any): Promise<void>`
Updates a request's information.

**Parameters:**
- `id: string` - Request document ID
- `updates: any` - Fields to update

**Usage:**
```typescript
await updateRequest("request-id", {
  status: "approved",
  paymentStatus: "verified",
  downloadEnabled: true,
  transactionId: "TXN123456789"
});
```

---

### File Operations

#### `uploadScreenshot(file: File, requestId: string): Promise<string>`
Uploads a payment screenshot to Firebase Storage.

**Parameters:**
- `file: File` - File object from input
- `requestId: string` - Request ID for organization

**Returns:** `Promise<string>` - Download URL of uploaded file

**Usage:**
```typescript
const inputElement = document.getElementById("file-input") as HTMLInputElement;
const file = inputElement.files?.[0];

if (file) {
  const downloadUrl = await uploadScreenshot(file, "REQ-2026-0001");
  // Save downloadUrl to database
}
```

---

### Analytics Operations

#### `getAnalytics(): Promise<AnalyticsData>`
Retrieves overall platform analytics.

**Returns:** 
```javascript
{
  totalProjects: number,
  totalRequests: number,
  totalSales: number,
  totalRevenue: number,
  totalDownloads: number,
  conversionRate: string // As percentage
}
```

**Usage:**
```typescript
const analytics = await getAnalytics();
console.log(`Revenue: ₹${analytics.totalRevenue}`);
console.log(`Conversion Rate: ${analytics.conversionRate}%`);
```

---

### Settings Operations

#### `updateAdminSettings(settings: any): Promise<void>`
Updates admin settings in database.

**Parameters:**
```javascript
{
  whatsappNumber: "+91 9876543210",
  email: "support@example.com",
  upiId: "user@bank",
  bankAccount: "XXXX XXXX 1234",
  bankIfsc: "HDFC0001234",
  companyName: "My Company"
}
```

**Usage:**
```typescript
await updateAdminSettings({
  whatsappNumber: "+91 9876543210",
  email: "support@example.com"
});
```

---

#### `getAdminSettings(): Promise<any | null>`
Retrieves admin settings.

**Returns:** `Promise<AdminSettings | null>`

**Usage:**
```typescript
const settings = await getAdminSettings();
if (settings) {
  console.log("WhatsApp:", settings.whatsappNumber);
}
```

---

## State Management (Zustand Stores)

### Auth Store

```typescript
import { useAuthStore } from '@/lib/store';

// Get user
const user = useAuthStore((state) => state.user);

// Get loading state
const loading = useAuthStore((state) => state.loading);

// Set user
const setUser = useAuthStore((state) => state.setUser);
setUser(currentUser);

// Set loading
const setLoading = useAuthStore((state) => state.setLoading);
setLoading(false);
```

---

### Project Store

```typescript
import { useProjectStore } from '@/lib/store';

// Get all projects
const projects = useProjectStore((state) => state.projects);

// Get loading state
const loading = useProjectStore((state) => state.loading);

// Set projects
const setProjects = useProjectStore((state) => state.setProjects);
setProjects(projectsData);

// Add project
const addProject = useProjectStore((state) => state.addProject);
addProject(newProject);

// Update project
const updateProject = useProjectStore((state) => state.updateProject);
updateProject("project-id", { name: "New Name" });
```

---

### Request Store

```typescript
import { useRequestStore } from '@/lib/store';

// Get all requests
const requests = useRequestStore((state) => state.requests);

// Set requests
const setRequests = useRequestStore((state) => state.setRequests);
setRequests(requestsData);

// Add request
const addRequest = useRequestStore((state) => state.addRequest);
addRequest(newRequest);

// Update request
const updateRequest = useRequestStore((state) => state.updateRequest);
updateRequest("request-id", { status: "approved" });
```

---

### Settings Store

```typescript
import { useSettingsStore } from '@/lib/store';

// Get settings
const settings = useSettingsStore((state) => state.settings);

// Set settings
const setSettings = useSettingsStore((state) => state.setSettings);
setSettings(settingsData);
```

---

## Firebase Utilities

### Authentication

```typescript
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';

// Email login
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

// Google login
const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
const user = result.user;

// Logout
await signOut(auth);

// Listen to auth changes
const unsubscribe = onAuthStateChanged(auth, (user) => {
  if (user) {
    // User logged in
  } else {
    // User logged out
  }
});
```

---

## Common Patterns

### Request ID Generation

```typescript
const generateRequestId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const count = Math.floor(Math.random() * 10000);
  return `REQ-${year}-${String(count).padStart(4, '0')}`;
};

// Example output: REQ-2026-0042
```

---

### Complete Request Flow

```typescript
// 1. Generate Request ID
const requestId = generateRequestId();

// 2. Create request object
const requestData = {
  projectId: projectId,
  projectName: projectName,
  userName: formData.fullName,
  email: formData.email,
  phone: formData.phone,
  whatsapp: formData.whatsapp,
  requestId: requestId,
  status: 'pending',
  paymentStatus: 'not_paid',
  amount: projectPrice
};

// 3. Save to database
const docId = await addRequest(requestData);

// 4. Increment project requests
await updateProjectStats(projectId, 'requests', 1);

// 5. Update UI
setSuccess(true);
setRequestId(requestId);
```

---

### Complete Payment Verification Flow

```typescript
// 1. Get request
const request = await getRequestByRequestId("REQ-2026-0001");

// 2. Admin verifies details
if (
  request.amount === expectedAmount &&
  isRecentTransaction() &&
  isScreenshotValid()
) {
  // 3. Update request
  await updateRequest(request.id, {
    status: 'approved',
    paymentStatus: 'verified',
    downloadEnabled: true
  });

  // 4. Update project stats
  await updateProjectStats(request.projectId, 'sales', 1);
  await updateProjectStats(request.projectId, 'revenue', request.amount);

  // 5. Send notification to user
  sendNotification(request.whatsapp, request.email);
}
```

---

## Error Handling

### Try-Catch Pattern

```typescript
try {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }
  setProject(project);
} catch (error) {
  console.error("Error loading project:", error);
  setError("Failed to load project");
} finally {
  setLoading(false);
}
```

---

## TypeScript Types

### Project Type

```typescript
interface Project {
  id: string;
  name: string;
  techStack: string[];
  category: string;
  subcategory: string;
  generalPrice: number;
  discountedPrice: number;
  shortDescription: string;
  fullSynopsis: string;
  features: string[];
  githubLink: string;
  youtubeLink: string;
  learningResourcesLink: string;
  vivaQuestionsLink?: string;
  howToRun: string;
  difficulty: string;
  tags: string[];
  views: number;
  requests: number;
  sales: number;
  revenue: number;
  rating: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
```

---

### Request Type

```typescript
interface Request {
  id: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  whatsapp: string;
  collegeName?: string;
  message?: string;
  requestId: string;
  status: 'pending' | 'details_sent' | 'screenshot_submitted' | 'approved' | 'rejected';
  paymentStatus: 'not_paid' | 'pending_verification' | 'verified';
  amount: number;
  screenshotUrl?: string;
  transactionId?: string;
  downloadEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Components Props

### RequestModal Props

```typescript
interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  projectPrice: number;
}
```

---

This reference covers all major functions and patterns used throughout the application!
