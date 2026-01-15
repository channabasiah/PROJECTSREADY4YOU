import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-[#0b0e27] border-b border-neon-cyan z-40 box-glow-cyan">
      <div className="max-w-full px-4 sm:px-8 py-4">
        {/* Navbar Content */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-green rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl neon-glow">Projects Ready</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/projects" className="text-text-light hover:text-primary transition-colors">
              Projects
            </Link>
            {user ? (
              <>
                <Link href="/user-dashboard" className="text-text-light hover:text-primary transition-colors">
                  Dashboard
                </Link>
                
                {/* User Info with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors"
                  >
                    <span className="text-sm">{user.displayName || user.email?.split('@')[0]}</span>
                    <FiLogOut size={18} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-[#151a36] border-2 border-neon-cyan rounded-lg p-3 z-50"
                    >
                      <p className="text-neon-cyan text-sm font-bold mb-3">
                        Welcome back! 👋
                      </p>
                      {user.email?.includes('admin') && (
                        <Link href="/admin">
                          <button className="w-full text-left px-3 py-2 text-text-light hover:text-primary transition-colors text-sm mb-2">
                            Admin Panel
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-400 transition-colors text-sm"
                      >
                        <FiLogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <button className="px-6 py-2 text-blue-600 font-bold border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-primary hover:text-primary transition-colors"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#1a1a2e] border-t border-[#2d3748] p-4 space-y-4"
        >
          <Link href="/projects" className="block text-text-light hover:text-primary transition-colors">
            Projects
          </Link>
          {user ? (
            <>
              <Link href="/user-dashboard" className="block text-text-light hover:text-primary transition-colors">
                Dashboard
              </Link>
              <div className="border-t border-[#2d3748] pt-4">
                <p className="text-neon-cyan text-sm font-bold mb-3">
                  Welcome back, {user.displayName || user.email}! 👋
                </p>
                {user.email?.includes('admin') && (
                  <Link href="/admin" className="block text-text-light hover:text-primary transition-colors mb-2">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-left text-red-500 hover:text-red-400 transition-colors"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/login">
                <button className="w-full px-6 py-2 text-blue-600 font-bold border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="w-full px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
