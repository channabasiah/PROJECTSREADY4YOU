import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up mode
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        
        // Check if admin
        if (userCredential.user.email?.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        // Sign in mode
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        
        // Check if admin
        if (userCredential.user.email?.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);

      if (result.user.email?.includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b0e27] via-[#151a36] to-[#0b0e27] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Animated background */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-neon-green rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4 sm:px-0"
      >
        <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-6 sm:p-8 box-glow-cyan">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-r from-neon-cyan to-neon-green rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-black">P</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold neon-glow mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-text-light text-sm sm:text-base">{isSignUp ? 'Sign up to get started' : 'Sign in to your account'}</p>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Email Login */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-text-light text-sm mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@projects4you.com"
                  className="w-full px-4 py-3 pl-10 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-light text-sm mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-10 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (
                <>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-neon-cyan"></div>
            <p className="text-text-light text-sm">OR</p>
            <div className="flex-1 border-t border-neon-cyan"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 bg-[#0b0e27] border-2 border-neon-green text-neon-green font-bold rounded-lg hover:bg-neon-green hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            🔷 Sign in with Google
          </button>

          {/* Footer */}
          <p className="text-center text-text-light text-sm mt-6">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => {
                if (!isSignUp) {
                  router.push('/signup');
                } else {
                  setIsSignUp(!isSignUp);
                  setError('');
                }
              }}
              className="text-neon-green hover:text-neon-cyan transition-colors font-semibold"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
