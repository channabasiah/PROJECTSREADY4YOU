import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSettings, FiMail, FiBarChart2, FiUsers, FiPackage } from 'react-icons/fi';
import { useAuthStore } from '@/lib/store';

const AdminDashboard = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      router.push('/login');
      return;
    }

    if (!user.email?.includes('admin')) {
      alert('⛔ Access Denied! Only admins can access this page.');
      router.push('/projects');
      return;
    }
  }, [user, router]);

  const adminFeatures = [
    {
      id: 1,
      title: '📧 Email Settings',
      description: 'Customize email templates and support contact information',
      icon: FiMail,
      link: '/admin/email-settings',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      title: '📊 Analytics',
      description: 'View project statistics, requests, and revenue',
      icon: FiBarChart2,
      link: '/admin/analytics',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 3,
      title: '👥 Users',
      description: 'Manage user profiles and permissions',
      icon: FiUsers,
      link: '/admin/users',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 4,
      title: '📦 Projects',
      description: 'Manage and moderate all projects',
      icon: FiPackage,
      link: '/admin/projects',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 5,
      title: '⚙️ Settings',
      description: 'General platform settings and configuration',
      icon: FiSettings,
      link: '/admin/settings',
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b0e27] via-[#151a36] to-[#0b0e27] py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/projects')}
          className="flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors mb-8"
        >
          <FiArrowLeft size={20} />
          Back to Projects
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold neon-cyan-glow mb-4">Admin Dashboard</h1>
          <p className="text-text-light text-lg">Welcome back! Manage your platform settings and content.</p>
        </motion.div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(feature.link)}
                className="group cursor-pointer"
              >
                <div className="h-full bg-[#151a36] border-2 border-neon-cyan rounded-lg p-6 hover:border-neon-green transition-all hover:shadow-neon-glow hover:scale-105">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-text-light text-sm mb-4">{feature.description}</p>

                  {/* Action Button */}
                  <div className="flex items-center gap-2 text-neon-green font-semibold group-hover:gap-3 transition-all">
                    <span>Open</span>
                    <span>→</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-[#151a36] border-2 border-neon-cyan rounded-lg p-8 box-glow-cyan"
        >
          <h2 className="text-2xl font-bold neon-cyan-glow mb-6">📈 Quick Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-green mb-2">0</p>
              <p className="text-text-light text-sm">Total Projects</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-cyan mb-2">0</p>
              <p className="text-text-light text-sm">Active Requests</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400 mb-2">0</p>
              <p className="text-text-light text-sm">Registered Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400 mb-2">₹0</p>
              <p className="text-text-light text-sm">Total Revenue</p>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-[#0b0e27] border-2 border-neon-green rounded-lg p-8 box-glow-green"
        >
          <h3 className="text-xl font-bold neon-green-glow mb-4">💡 Admin Tips</h3>
          <ul className="space-y-3 text-text-light">
            <li className="flex gap-3">
              <span className="text-neon-green">✓</span>
              <span>Go to <strong>Email Settings</strong> to customize email templates and support contact info</span>
            </li>
            <li className="flex gap-3">
              <span className="text-neon-green">✓</span>
              <span>Check <strong>Analytics</strong> to track requests, revenue, and user engagement</span>
            </li>
            <li className="flex gap-3">
              <span className="text-neon-green">✓</span>
              <span>Manage <strong>Projects</strong> to add, edit, or remove project listings</span>
            </li>
            <li className="flex gap-3">
              <span className="text-neon-green">✓</span>
              <span>Review <strong>Users</strong> for user management and support requests</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
