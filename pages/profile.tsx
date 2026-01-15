import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { useAuthStore } from '@/lib/store';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getUserProfile, saveUserProfile } from '@/lib/db';

const UserProfile = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeName: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setProfileData({
            name: profile.name || '',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
            collegeName: profile.collegeName || '',
          });
        } else {
          setProfileData({
            name: '',
            email: user.email || '',
            phone: '',
            collegeName: '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, router]);

  const handleSaveProfile = async (e: any) => {
    e.preventDefault();
    
    if (!profileData.name || !profileData.phone || !profileData.collegeName) {
      setMessage('✗ Please fill all required fields');
      return;
    }

    if (!/^[0-9]{10}$/.test(profileData.phone)) {
      setMessage('✗ Please enter a valid 10-digit phone number');
      return;
    }

    setSaving(true);
    try {
      await saveUserProfile(user.uid, {
        ...profileData,
        profileCompleted: true,
      });
      setMessage('✓ Profile saved successfully!');
      setTimeout(() => {
        router.push('/projects');
      }, 1500);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e27] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b0e27] via-[#151a36] to-[#0b0e27] py-8 sm:py-12 md:py-16">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 max-w-2xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Profile' }]} />
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors mb-8"
        >
          <FiArrowLeft size={20} />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-8 box-glow-cyan"
        >
          <h1 className="text-3xl md:text-4xl font-bold neon-cyan-glow mb-2">Complete Your Profile</h1>
          <p className="text-text-light mb-8">Fill your details so you can request projects without entering information every time.</p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg font-semibold flex items-center gap-2 ${
              message.startsWith('✓')
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {message.startsWith('✓') ? <FiCheck size={20} /> : <FiX size={20} />}
              {message}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-light text-sm font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-text-light text-sm font-semibold mb-2">Email (Auto-filled)</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-text-light opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Row 2: Phone and College Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-light text-sm font-semibold mb-2">Phone Number (10 digits) *</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  maxLength={10}
                  className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-text-light text-sm font-semibold mb-2">College / University Name *</label>
                <input
                  type="text"
                  placeholder="Your college or university name"
                  value={profileData.collegeName}
                  onChange={(e) => setProfileData({ ...profileData, collegeName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiCheck size={20} />
              {saving ? 'Saving Profile...' : 'Save & Continue'}
            </button>
          </form>

          <p className="text-text-light text-xs text-center mt-6">
            💡 You can update your profile anytime from settings
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
