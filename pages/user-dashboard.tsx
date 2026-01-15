import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiCheck, FiClock, FiX, FiUser, FiMail, FiPhone, FiBook } from 'react-icons/fi';
import { useAuthStore } from '@/lib/store';
import { getRequestsByUserEmail, getUserProfile } from '@/lib/db';

interface Request {
  id: string;
  requestId: string;
  projectName: string;
  amount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  downloadLink?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  collegeName: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [requests, setRequests] = useState<Request[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      if (user?.email) {
        // Load user's requests
        const userRequests = await getRequestsByUserEmail(user.email);
        setRequests(userRequests);

        // Load user profile
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e27] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  // Calculate stats
  const verifiedCount = requests.filter((r) => r.paymentStatus === 'verified').length;
  const pendingCount = requests.filter((r) => r.paymentStatus === 'pending_verification').length;
  const totalSpent = requests
    .filter((r) => r.paymentStatus === 'verified')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0b0e27] text-white pt-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: FiUser },
            { id: 'requests', label: 'My Purchases', icon: FiDownload },
            { id: 'profile', label: 'Profile', icon: FiUser },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-black'
                    : 'bg-[#151a36] border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-4 sm:p-6 box-glow-cyan">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-light text-xs sm:text-sm mb-2">Total Purchases</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neon-cyan">{requests.length}</p>
                  </div>
                  <FiDownload size={32} className="text-neon-cyan opacity-50" />
                </div>
              </div>

              <div className="bg-[#151a36] border-2 border-green-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-light text-xs sm:text-sm mb-2">Verified</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-500">{verifiedCount}</p>
                  </div>
                  <FiCheck size={32} className="text-green-500 opacity-50" />
                </div>
              </div>

              <div className="bg-[#151a36] border-2 border-yellow-500 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-light text-xs sm:text-sm mb-2">Pending</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-500">{pendingCount}</p>
                  </div>
                  <FiClock size={32} className="text-yellow-500 opacity-50" />
                </div>
              </div>

              <div className="bg-[#151a36] border-2 border-neon-green rounded-lg p-4 sm:p-6 box-glow-green">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-light text-xs sm:text-sm mb-2">Total Spent</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neon-green">₹{totalSpent}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl">💰</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Purchases Tab */}
        {activeTab === 'requests' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FiDownload size={44} className="mx-auto text-neon-cyan/50 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-text-light mb-2">No purchases yet</h3>
                <p className="text-text-light text-sm sm:text-base mb-6">Start exploring and purchase your first project!</p>
                <button
                  onClick={() => router.push('/projects')}
                  className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all text-sm sm:text-base"
                >
                  Browse Projects
                </button>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {requests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#151a36] border-2 border-neon-green rounded-lg p-4 sm:p-6 hover:border-neon-cyan transition-colors w-full"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
                      <div>
                        <p className="text-text-light text-xs mb-1">Project</p>
                        <p className="font-bold text-neon-cyan text-sm sm:text-base">{request.projectName}</p>
                      </div>

                      <div>
                        <p className="text-text-light text-xs mb-1">Amount</p>
                        <p className="font-bold text-neon-green text-sm sm:text-base">₹{request.amount}</p>
                      </div>

                      <div>
                        <p className="text-text-light text-xs mb-1">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          {request.paymentStatus === 'verified' && (
                            <>
                              <FiCheck size={16} className="text-green-500" />
                              <span className="text-green-500 font-bold text-xs sm:text-sm">Verified</span>
                            </>
                          )}
                          {request.paymentStatus === 'pending_verification' && (
                            <>
                              <FiClock size={16} className="text-yellow-500" />
                              <span className="text-yellow-500 font-bold text-xs sm:text-sm">Pending</span>
                            </>
                          )}
                          {request.paymentStatus === 'rejected' && (
                            <>
                              <FiX size={16} className="text-red-500" />
                              <span className="text-red-500 font-bold text-xs sm:text-sm">Rejected</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="sm:text-right">
                        {request.paymentStatus === 'verified' ? (
                          <a
                            href={request.downloadLink || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all inline-flex items-center gap-2 text-xs sm:text-sm"
                          >
                            <FiDownload size={14} />
                            Download
                          </a>
                        ) : (
                          <button
                            disabled
                            className="px-4 py-2 bg-[#0b0e27] border border-text-light text-text-light rounded-lg text-xs sm:text-sm opacity-50 cursor-not-allowed"
                          >
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neon-green/30 text-xs text-text-light space-y-1 sm:space-y-0 sm:flex sm:gap-4">
                      <span>Request ID: {request.requestId}</span>
                      <span>Date: {new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-full bg-[#151a36] border-2 border-neon-cyan rounded-lg p-4 sm:p-6 lg:p-8 box-glow-cyan">
              <h2 className="text-xl sm:text-2xl font-bold text-neon-cyan mb-6">Profile Information</h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-text-light text-xs sm:text-sm font-semibold mb-2">
                    <FiUser size={16} />
                    Full Name
                  </label>
                  <div className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white text-sm sm:text-base">
                    {profile?.name || user?.displayName || 'Not set'}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-text-light text-xs sm:text-sm font-semibold mb-2">
                    <FiMail size={16} />
                    Email
                  </label>
                  <div className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white text-sm sm:text-base">
                    {profile?.email || user?.email}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-text-light text-xs sm:text-sm font-semibold mb-2">
                    <FiPhone size={16} />
                    Phone
                  </label>
                  <div className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white text-sm sm:text-base">
                    {profile?.phone || 'Not set'}
                  </div>
                </div>

                {/* College */}
                <div>
                  <label className="flex items-center gap-2 text-text-light text-xs sm:text-sm font-semibold mb-2">
                    <FiBook size={16} />
                    College Name
                  </label>
                  <div className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white text-sm sm:text-base">
                    {profile?.collegeName || 'Not set'}
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all text-sm sm:text-base"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
