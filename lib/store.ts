import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

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

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  setLoading: (loading) => set({ loading }),
}));

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

interface RequestStore {
  requests: Request[];
  loading: boolean;
  setRequests: (requests: Request[]) => void;
  addRequest: (request: Request) => void;
  updateRequest: (id: string, updates: Partial<Request>) => void;
  setLoading: (loading: boolean) => void;
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  loading: false,
  setRequests: (requests) => set({ requests }),
  addRequest: (request) => set((state) => ({ requests: [...state.requests, request] })),
  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  setLoading: (loading) => set({ loading }),
}));

interface AdminSettings {
  whatsappNumber: string;
  email: string;
  upiId: string;
  bankAccount: string;
  bankIfsc: string;
  companyName: string;
  youtubeChannelLink: string;
  githubOrgLink: string;
}

interface SettingsStore {
  settings: AdminSettings | null;
  setSettings: (settings: AdminSettings) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
}));
