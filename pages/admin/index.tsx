import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { FiBarChart, FiUsers, FiDownload, FiDollarSign, FiPlus, FiSettings, FiCheck, FiX, FiMail } from 'react-icons/fi';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAnalytics, getRequests, getProjects, updateRequest } from '@/lib/db';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Admin = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [savingTransaction, setSavingTransaction] = useState(false);
  
  // Admin form state
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');

  // Add Project form state
  const [projectForm, setProjectForm] = useState<any>({
    name: '',
    price: '',
    discountedPrice: '',
    category: '',
    shortDescription: '',
    description: '',
    synopsis: '',
    techStack: '',
    youtubeDemo: '',
    trailer: '',
    projectLink: '',
    downloadLink: '',
    learningResources: '',
    vivaQuestions: '',
  });
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState('');

  useEffect(() => {
    // Verify admin access
    if (!user || !user.email?.includes('admin')) {
      router.push('/login');
      return;
    }

    loadDashboardData();
  }, [router, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsData, requestsData, projectsData] = await Promise.all([
        getAnalytics(),
        getRequests(),
        getProjects(),
      ]);

      setAnalytics(analyticsData);
      setRequests(requestsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (requestId: string) => {
    if (!transactionId.trim()) {
      alert('Please enter Transaction ID');
      return;
    }

    setSavingTransaction(true);
    try {
      await updateRequest(requestId, {
        paymentStatus: 'verified',
        downloadEnabled: true,
        transactionId: transactionId,
        verifiedAt: new Date().toISOString(),
      });

      // Update project sales and revenue
      const request = requests.find((r) => r.id === requestId);
      if (request) {
        const projectIndex = projects.findIndex((p) => p.id === request.projectId);
        if (projectIndex !== -1) {
          setProjects([
            ...projects.slice(0, projectIndex),
            {
              ...projects[projectIndex],
              sales: (projects[projectIndex].sales || 0) + 1,
              revenue: (projects[projectIndex].revenue || 0) + request.amount,
            },
            ...projects.slice(projectIndex + 1),
          ]);
        }
      }

      // Update requests list
      setRequests(
        requests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                paymentStatus: 'verified',
                downloadEnabled: true,
                transactionId: transactionId,
                verifiedAt: new Date().toISOString(),
              }
            : r
        )
      );

      setTransactionId('');
      setSelectedRequest(null);
      alert('Payment verified! Download enabled.');
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Error approving payment');
    } finally {
      setSavingTransaction(false);
    }
  };

  const handleRejectPayment = async (requestId: string) => {
    setSavingTransaction(true);
    try {
      await updateRequest(requestId, {
        paymentStatus: 'rejected',
        downloadEnabled: false,
        rejectedAt: new Date().toISOString(),
      });

      setRequests(
        requests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                paymentStatus: 'rejected',
                downloadEnabled: false,
                rejectedAt: new Date().toISOString(),
              }
            : r
        )
      );

      setSelectedRequest(null);
      alert('Payment rejected.');
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Error rejecting payment');
    } finally {
      setSavingTransaction(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminMessage('');

    try {
      if (!adminEmail.includes('admin')) {
        setAdminMessage('Email must contain "admin" to create admin account');
        setAdminLoading(false);
        return;
      }

      await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      setAdminMessage('✓ Admin user created successfully!');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      
      setTimeout(() => setAdminMessage(''), 3000);
    } catch (error: any) {
      setAdminMessage(`✗ Error: ${error.message}`);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectLoading(true);
    setProjectMessage('');

    try {
      if (!projectForm.name || !projectForm.price || !projectForm.category) {
        setProjectMessage('Please fill in all required fields');
        setProjectLoading(false);
        return;
      }

      // Import addProject function
      const { addProject } = await import('@/lib/db');

      const projectId = await addProject({
        name: projectForm.name,
        price: parseInt(projectForm.price),
        discountedPrice: projectForm.discountedPrice ? parseInt(projectForm.discountedPrice) : null,
        category: projectForm.category,
        shortDescription: projectForm.shortDescription || projectForm.description,
        description: projectForm.description,
        synopsis: projectForm.synopsis,
        techStack: projectForm.techStack,
        youtubeDemo: projectForm.youtubeDemo,
        trailer: projectForm.trailer,
        projectLink: projectForm.projectLink,
        downloadLink: projectForm.downloadLink,
        learningResources: projectForm.learningResources,
        vivaQuestions: projectForm.vivaQuestions,
      });

      setProjectMessage('✓ Project added successfully!');
      
      // Reset form
      setProjectForm({
        name: '',
        price: '',
        discountedPrice: '',
        category: '',
        shortDescription: '',
        description: '',
        synopsis: '',
        techStack: '',
        youtubeDemo: '',
        trailer: '',
        projectLink: '',
        downloadLink: '',
        learningResources: '',
        vivaQuestions: '',
      });

      // Reload projects
      const updatedProjects = await getProjects();
      setProjects(updatedProjects);

      setTimeout(() => setProjectMessage(''), 3000);
    } catch (error: any) {
      console.error('Error adding project:', error);
      setProjectMessage(`✗ Error: ${error.message}`);
    } finally {
      setProjectLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiBarChart },
    { id: 'add-project', label: 'Add Project', icon: FiPlus },
    { id: 'requests', label: 'Payment Requests', icon: FiUsers },
    { id: 'projects', label: 'Projects', icon: FiDownload },
    { id: 'email-settings', label: 'Email Settings', icon: FiMail },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e27] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0e27]">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Dashboard' }]} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-black box-glow-cyan'
                    : 'bg-[#151a36] border border-neon-cyan text-text-light hover:text-neon-green'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Stats Cards - 3 Column Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[
                { label: 'Total Revenue', value: `₹${analytics?.totalRevenue || 0}`, icon: FiDollarSign, color: 'neon-green' },
                { label: 'Total Sales', value: analytics?.totalSales || 0, icon: FiDownload, color: 'neon-cyan' },
                { label: 'Total Requests', value: analytics?.totalRequests || 0, icon: FiUsers, color: 'neon-green' },
                { label: 'Total Projects', value: projects?.length || 0, icon: FiPlus, color: 'neon-cyan' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-[#151a36] border border-${stat.color} rounded-lg p-4 sm:p-6 box-glow-${stat.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-light text-xs sm:text-sm">{stat.label}</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold neon-glow mt-1 sm:mt-2">{stat.value}</p>
                      </div>
                      <Icon className="text-neon-cyan hidden sm:block" size={35} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Analytics and Trends Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Revenue Trend */}
              <div className="bg-[#151a36] border border-neon-green rounded-lg p-4 sm:p-6 box-glow-green">
                <h3 className="text-lg sm:text-xl font-bold neon-green-glow mb-4">Revenue Analytics</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-text-light text-xs sm:text-sm">Average per Sale</span>
                      <span className="text-neon-green font-bold">₹{analytics?.totalSales ? Math.round(analytics.totalRevenue / analytics.totalSales) : 0}</span>
                    </div>
                    <div className="w-full bg-[#0b0e27] rounded-full h-2">
                      <div className="bg-gradient-to-r from-neon-cyan to-neon-green h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-text-light text-xs sm:text-sm">Total Revenue</span>
                      <span className="text-neon-cyan font-bold">₹{analytics?.totalRevenue || 0}</span>
                    </div>
                    <div className="w-full bg-[#0b0e27] rounded-full h-2">
                      <div className="bg-gradient-to-r from-neon-green to-neon-cyan h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-neon-green/30">
                    <p className="text-text-light text-xs mt-2">💡 Avg conversion rate improving month over month</p>
                  </div>
                </div>
              </div>

              {/* Request Status Distribution */}
              <div className="bg-[#151a36] border border-neon-cyan rounded-lg p-4 sm:p-6 box-glow-cyan">
                <h3 className="text-lg sm:text-xl font-bold neon-cyan-glow mb-4">Request Status Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-text-light text-xs sm:text-sm">Verified</span>
                      <span className="text-green-400 font-bold">{requests?.filter(r => r.paymentStatus === 'verified').length || 0}</span>
                    </div>
                    <div className="w-full bg-[#0b0e27] rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: `${requests?.length ? Math.round((requests.filter(r => r.paymentStatus === 'verified').length / requests.length) * 100) : 0}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-text-light text-xs sm:text-sm">Pending Verification</span>
                      <span className="text-yellow-400 font-bold">{requests?.filter(r => r.paymentStatus === 'pending_verification').length || 0}</span>
                    </div>
                    <div className="w-full bg-[#0b0e27] rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${requests?.length ? Math.round((requests.filter(r => r.paymentStatus === 'pending_verification').length / requests.length) * 100) : 0}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-text-light text-xs sm:text-sm">Rejected</span>
                      <span className="text-red-400 font-bold">{requests?.filter(r => r.paymentStatus === 'rejected').length || 0}</span>
                    </div>
                    <div className="w-full bg-[#0b0e27] rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{width: `${requests?.length ? Math.round((requests.filter(r => r.paymentStatus === 'rejected').length / requests.length) * 100) : 0}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Performance */}
              <div className="bg-[#151a36] border border-neon-green rounded-lg p-4 sm:p-6 box-glow-green">
                <h3 className="text-lg sm:text-xl font-bold neon-green-glow mb-4">Top Projects by Views</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {projects?.sort((a: any, b: any) => (b.views || 0) - (a.views || 0))?.slice(0, 5).map((project: any, i: number) => (
                    <div key={project.id} className="flex justify-between items-center p-2 bg-[#0b0e27] rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-neon-cyan font-bold text-sm">#{i + 1}</span>
                        <span className="text-text-light text-xs sm:text-sm truncate">{project.name}</span>
                      </div>
                      <span className="text-neon-green font-bold text-xs sm:text-sm">{project.views || 0} 👁️</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="bg-[#151a36] border border-neon-cyan rounded-lg p-4 sm:p-6 box-glow-cyan">
                <h3 className="text-lg sm:text-xl font-bold neon-cyan-glow mb-4">Engagement Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-light text-xs sm:text-sm">Avg Views per Project</span>
                    <span className="text-neon-cyan font-bold">{projects?.length ? Math.round(projects.reduce((sum: number, p: any) => sum + (p.views || 0), 0) / projects.length) : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-light text-xs sm:text-sm">Avg Requests per Project</span>
                    <span className="text-neon-green font-bold">{projects?.length ? Math.round(projects.reduce((sum: number, p: any) => sum + (p.requests || 0), 0) / projects.length) : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-light text-xs sm:text-sm">Conversion Rate</span>
                    <span className="text-neon-cyan font-bold">{analytics?.totalSales && analytics?.totalRequests ? Math.round((analytics.totalSales / analytics.totalRequests) * 100) : 0}%</span>
                  </div>
                  <div className="pt-2 border-t border-neon-cyan/30">
                    <p className="text-text-light text-xs mt-2">📈 User engagement is {analytics?.totalRequests > 10 ? 'excellent' : 'good'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#151a36] border border-neon-cyan rounded-lg p-6 box-glow-cyan">
              <h2 className="text-2xl font-bold neon-cyan-glow mb-4">All Payment Requests</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neon-cyan">
                      <th className="text-left py-3 px-4 text-neon-cyan">Request ID</th>
                      <th className="text-left py-3 px-4 text-neon-cyan">User</th>
                      <th className="text-left py-3 px-4 text-neon-cyan">Email</th>
                      <th className="text-left py-3 px-4 text-neon-cyan">Amount</th>
                      <th className="text-left py-3 px-4 text-neon-cyan">Payment Status</th>
                      <th className="text-left py-3 px-4 text-neon-cyan">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b border-[#0b0e27] hover:bg-[#0b0e27] transition-colors">
                        <td className="py-3 px-4 font-mono text-neon-green">{req.requestId}</td>
                        <td className="py-3 px-4">{req.userName}</td>
                        <td className="py-3 px-4 text-neon-cyan">{req.email}</td>
                        <td className="py-3 px-4 font-bold">₹{req.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            req.paymentStatus === 'verified' ? 'bg-green-500 text-white' :
                            req.paymentStatus === 'pending_verification' ? 'bg-yellow-500 text-white' :
                            req.paymentStatus === 'rejected' ? 'bg-red-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {req.paymentStatus.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="text-neon-cyan hover:text-neon-green transition-colors text-sm font-bold hover:underline"
                          >
                            Verify Payment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Verification Modal */}
            {selectedRequest && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#151a36] border-2 border-neon-green rounded-lg p-8 box-glow-green"
              >
                <h3 className="text-2xl font-bold neon-green-glow mb-6">Verify Payment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-text-light text-sm">Request ID</p>
                    <p className="text-lg font-bold text-neon-green">{selectedRequest.requestId}</p>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">User</p>
                    <p className="text-lg font-bold">{selectedRequest.userName}</p>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">Email</p>
                    <p className="text-lg font-semibold">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">Amount</p>
                    <p className="text-lg font-bold text-neon-cyan">₹{selectedRequest.amount}</p>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">Project</p>
                    <p className="text-lg font-semibold">{selectedRequest.projectName}</p>
                  </div>
                  <div>
                    <p className="text-text-light text-sm">WhatsApp</p>
                    <p className="text-lg font-semibold">{selectedRequest.whatsapp}</p>
                  </div>
                </div>

                <div className="bg-[#0b0e27] border border-neon-cyan rounded-lg p-4 mb-6">
                  <p className="text-text-light text-sm mb-3">User Message/Requirements:</p>
                  <p className="text-white">{selectedRequest.message || 'No additional message'}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-text-light text-sm mb-2">
                    🔐 Enter Transaction ID (screenshot from WhatsApp/Email):
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g., UPI123456789 or TXN-2026-001"
                    className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan transition-all"
                  />
                  <p className="text-text-light text-xs mt-2">
                    💡 Note: Copy the transaction ID from the screenshot the user sent via WhatsApp
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprovePayment(selectedRequest.id)}
                    disabled={savingTransaction}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiCheck size={18} />
                    {savingTransaction ? 'Processing...' : 'Approve & Enable Download'}
                  </button>
                  <button
                    onClick={() => handleRejectPayment(selectedRequest.id)}
                    disabled={savingTransaction}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FiX size={18} />
                    {savingTransaction ? 'Processing...' : 'Reject Payment'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(null);
                      setTransactionId('');
                    }}
                    className="px-6 py-3 bg-[#0b0e27] border border-neon-cyan text-neon-cyan font-bold rounded-lg hover:text-neon-green transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {projects.map((project) => (
              <div key={project.id} className="bg-[#151a36] border border-neon-green rounded-lg p-4 sm:p-6 box-glow-green">
                <h3 className="text-base sm:text-lg font-bold neon-green-glow mb-2">{project.name}</h3>
                <p className="text-text-light text-xs sm:text-sm mb-3">{project.shortDescription}</p>
                <div className="space-y-1 text-xs sm:text-sm text-text-light">
                  <div>Views: {project.views}</div>
                  <div>Requests: {project.requests}</div>
                  <div>Sales: {project.sales}</div>
                  <div className="font-bold neon-cyan-glow">Revenue: ₹{project.revenue}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'add-project' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#151a36] border-2 border-neon-green rounded-lg p-6 sm:p-8 box-glow-green w-full"
          >
            <h2 className="text-2xl sm:text-3xl font-bold neon-green-glow mb-6">Add New Project</h2>
            
            {projectMessage && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-semibold ${
                projectMessage.startsWith('✓') 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {projectMessage}
              </div>
            )}

            <form onSubmit={handleAddProject} className="space-y-4 sm:space-y-6">
              {/* Row 1: Project Name, Price, Discounted Price, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Project Name *</label>
                  <input type="text" placeholder="Enter project name" value={projectForm.name} onChange={(e) => setProjectForm({...projectForm, name: e.target.value})} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green text-sm" required />
                </div>
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Price (₹) *</label>
                  <input type="number" placeholder="Regular price" value={projectForm.price} onChange={(e) => setProjectForm({...projectForm, price: e.target.value})} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green text-sm" required />
                </div>
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Discounted Price (₹)</label>
                  <input type="number" placeholder="Sale price (optional)" value={projectForm.discountedPrice} onChange={(e) => setProjectForm({...projectForm, discountedPrice: e.target.value})} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green text-sm" />
                </div>
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Category *</label>
                  <select value={projectForm.category} onChange={(e) => setProjectForm({...projectForm, category: e.target.value})} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-sm" required>
                    <option value="">Select Category</option>
                    <option>Web Development</option>
                    <option>Mobile App</option>
                    <option>AI/ML</option>
                    <option>Data Science</option>
                    <option>Game Development</option>
                    <option>Desktop App</option>
                    <option>IoT/Embedded</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Description, Synopsis, Tech Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Description *</label>
                  <textarea placeholder="Detailed project description" value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} rows={3} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green resize-none text-sm" required></textarea>
                </div>
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Synopsis (Brief Summary) *</label>
                  <textarea placeholder="One-line to 2-3 line summary" value={projectForm.synopsis} onChange={(e) => setProjectForm({...projectForm, synopsis: e.target.value})} rows={3} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green resize-none text-sm" required></textarea>
                </div>
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Tech Stack Used *</label>
                  <textarea placeholder="e.g., React, Node.js, MongoDB, Python" value={projectForm.techStack} onChange={(e) => setProjectForm({...projectForm, techStack: e.target.value})} rows={3} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green resize-none text-sm" required></textarea>
                </div>
              </div>

              {/* Row 3: Demo and Project Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">YouTube Demo Link</label>
                  <input type="url" placeholder="https://youtube.com/watch?v=..." value={projectForm.youtubeDemo} onChange={(e) => setProjectForm({...projectForm, youtubeDemo: e.target.value})} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green text-sm" />
                </div>
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">YouTube Trailer Link</label>
                  <input type="url" placeholder="https://youtube.com/watch?v=..." value={projectForm.trailer} onChange={(e) => setProjectForm({...projectForm, trailer: e.target.value})} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green text-sm" />
                </div>
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Project Link (GitHub/Website) *</label>
                  <input type="url" placeholder="https://github.com/..." value={projectForm.projectLink} onChange={(e) => setProjectForm({...projectForm, projectLink: e.target.value})} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green text-sm" required />
                </div>
              </div>

              {/* Row 4: Download Link and Learning Resources */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Download/Live Link *</label>
                  <input type="url" placeholder="https://example.com/download" value={projectForm.downloadLink} onChange={(e) => setProjectForm({...projectForm, downloadLink: e.target.value})} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green text-sm" required />
                </div>
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Tech Stack Learning Resources (Optional)</label>
                  <textarea placeholder="Links to tutorials, documentation, etc. (one per line)" value={projectForm.learningResources} onChange={(e) => setProjectForm({...projectForm, learningResources: e.target.value})} rows={2} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green resize-none text-sm"></textarea>
                </div>
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Viva Questions (Optional)</label>
                  <textarea placeholder="Important interview questions (one per line)" value={projectForm.vivaQuestions} onChange={(e) => setProjectForm({...projectForm, vivaQuestions: e.target.value})} rows={2} className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green resize-none text-sm"></textarea>
                </div>
              </div>

              {/* Row 7: Includes (Checkboxes) */}
              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-3">Includes (What comes with this project) *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 bg-[#0b0e27] p-4 sm:p-6 rounded-lg border border-neon-green">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-neon-green transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-neon-green" />
                    <span className="text-text-light text-xs sm:text-sm">Source Code</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-neon-green transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-neon-green" />
                    <span className="text-text-light text-xs sm:text-sm">Documentation</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-neon-green transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-neon-green" />
                    <span className="text-text-light text-xs sm:text-sm">PPT</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-neon-green transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-neon-green" />
                    <span className="text-text-light text-xs sm:text-sm">Report</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-neon-green transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-neon-green" />
                    <span className="text-text-light text-xs sm:text-sm">DB Schema</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-neon-green transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-neon-green" />
                    <span className="text-text-light text-xs sm:text-sm">API Doc</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-neon-green transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-neon-green" />
                    <span className="text-text-light text-xs sm:text-sm">Video</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-neon-green transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-neon-green" />
                    <span className="text-text-light text-xs sm:text-sm">Install Guide</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={projectLoading} className="w-full py-3 sm:py-4 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                <FiPlus size={20} />
                {projectLoading ? 'Adding...' : 'Add Project'}
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'email-settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-6 sm:p-8 box-glow-cyan">
              <h2 className="text-2xl sm:text-3xl font-bold neon-cyan-glow mb-4">Email Template Settings</h2>
              <p className="text-text-light mb-6">Customize the email sent to users when they submit a request.</p>
              
              <button
                onClick={() => router.push('/admin/email-settings')}
                className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all flex items-center gap-2"
              >
                <FiMail size={20} />
                Edit Email Template
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            {/* Add New Admin */}
            <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-6 sm:p-8 box-glow-cyan w-full">
              <h2 className="text-2xl sm:text-3xl font-bold neon-cyan-glow mb-6">Add New Admin User</h2>
              
              {adminMessage && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-semibold ${
                  adminMessage.startsWith('✓') 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {adminMessage}
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-text-light text-sm font-semibold mb-2">Admin Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter admin name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan text-sm sm:text-base"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-text-light text-sm font-semibold mb-2">Email (must contain 'admin') *</label>
                  <input 
                    type="email" 
                    placeholder="admin@example.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan text-sm sm:text-base"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-text-light text-sm font-semibold mb-2">Password *</label>
                  <input 
                    type="password" 
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-2 sm:py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan text-sm sm:text-base"
                    required 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={adminLoading}
                  className="md:col-span-3 py-3 sm:py-4 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  <FiPlus size={20} />
                  {adminLoading ? 'Creating...' : 'Create Admin User'}
                </button>
              </form>
            </div>

            {/* Account Settings */}
            <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-6 sm:p-8 box-glow-cyan w-full">
              <h2 className="text-2xl sm:text-3xl font-bold neon-cyan-glow mb-6">Account Settings</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="pb-4 sm:pb-6 border-b border-neon-cyan">
                  <h3 className="text-base sm:text-lg font-bold text-text-light mb-3">Current Admin Email</h3>
                  <p className="text-text-light text-sm sm:text-base font-mono">{user?.email}</p>
                </div>

                <div className="pb-4 sm:pb-6 border-b border-neon-cyan">
                  <h3 className="text-base sm:text-lg font-bold text-text-light mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <span className="text-text-light text-sm sm:text-base">Email notifications for new requests</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <span className="text-text-light text-sm sm:text-base">Daily sales report</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-text-light mb-3">System Information</h3>
                  <div className="space-y-2 text-xs sm:text-sm text-text-light">
                    <p>Platform Version: 1.0.0</p>
                    <p>Database: Firestore</p>
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
