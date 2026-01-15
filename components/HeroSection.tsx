import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0e27] via-[#151a36] to-[#0b0e27] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-neon-green rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-neon-cyan rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 neon-glow">
            Projects Ready
            <br />
            <span className="neon-green-glow">For You</span>
          </h1>
          <p className="text-xl text-text-light mb-8 max-w-2xl mx-auto">
            Discover, request, and download production-ready projects with complete source code, documentation, and video tutorials.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full px-6 py-4 bg-[#151a36] border-2 border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green transition-all"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-neon-cyan to-neon-green text-black px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                <FiSearch size={20} />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {[
            { icon: '⚡', title: 'Production Ready', desc: 'Complete, tested projects ready to deploy' },
            { icon: '📚', title: 'Full Documentation', desc: 'Video tutorials, guides, and setup instructions' },
            { icon: '💰', title: 'Affordable Pricing', desc: 'Get premium projects at student-friendly prices' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-[#151a36] border border-neon-cyan rounded-lg p-6 box-glow-cyan"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 neon-cyan-glow">{feature.title}</h3>
              <p className="text-text-light">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mt-12"
        >
          <Link href="/projects">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all flex items-center gap-2">
              Explore All Projects
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
