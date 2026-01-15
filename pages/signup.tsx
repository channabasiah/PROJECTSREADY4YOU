import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with full name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName,
      });

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Signup error:', err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0b0e27] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-neon-green mb-2">Account Created! ✨</h1>
            <p className="text-text-light mb-6">Your account has been successfully created.</p>
            <p className="text-text-light mb-8">Redirecting you to sign in...</p>
            
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-cyan mx-auto"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e27] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent mb-2">
            Projects Ready 4 You
          </h1>
          <p className="text-text-light">Create your account to get started</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-8 box-glow-cyan">
          <h2 className="text-2xl font-bold text-neon-cyan mb-6">Sign Up</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3"
            >
              <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-500 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-text-light text-sm font-semibold mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-neon-cyan" size={20} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-text-light text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-neon-cyan" size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-text-light text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-neon-cyan" size={20} />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-text-light text-sm font-semibold mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-neon-cyan" size={20} />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neon-green/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#151a36] text-text-light">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <button
            onClick={() => router.push('/login')}
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-neon-cyan text-neon-cyan font-bold rounded-lg hover:bg-neon-cyan hover:text-black transition-all disabled:opacity-50"
          >
            Sign In
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-text-light text-xs mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
