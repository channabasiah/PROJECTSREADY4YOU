import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#0b0e27] border-t border-neon-cyan py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="font-bold text-lg mb-4 neon-green-glow">Projects Ready 4 You</h4>
            <p className="text-text-light text-sm">
              Your one-stop destination for production-ready projects with complete source code, documentation, and video tutorials.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="font-bold text-lg mb-4 neon-cyan-glow">Quick Links</h4>
            <ul className="space-y-2 text-text-light text-sm">
              <li><a href="/projects" className="hover:text-neon-green transition-colors">Explore Projects</a></li>
              <li><a href="/track" className="hover:text-neon-green transition-colors">Track Request</a></li>
              <li><a href="/login" className="hover:text-neon-green transition-colors">Admin Login</a></li>
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="font-bold text-lg mb-4 neon-green-glow">Categories</h4>
            <ul className="space-y-2 text-text-light text-sm">
              <li><a href="#" className="hover:text-neon-green transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-neon-green transition-colors">Mobile Apps</a></li>
              <li><a href="#" className="hover:text-neon-green transition-colors">Machine Learning</a></li>
              <li><a href="#" className="hover:text-neon-green transition-colors">DevOps</a></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="font-bold text-lg mb-4 neon-cyan-glow">Contact</h4>
            <div className="space-y-3 text-text-light text-sm">
              <div className="flex items-center gap-2">
                <FiMail className="text-neon-green" />
                <span>support@projects4you.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-neon-cyan" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-neon-cyan hover:text-neon-green transition-colors">
                  <FiGithub size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-neon-cyan my-8"></div>

        {/* Bottom */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-text-light text-sm">
          <p>&copy; 2026 Projects Ready 4 You. All rights reserved.</p>
          <p className="mt-2">
            Built with <span className="text-neon-green">❤️</span> for students and developers
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
