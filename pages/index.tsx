import React from 'react';
import HeroSection from '@/components/HeroSection';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiDownload } from 'react-icons/fi';

const Home = () => {
  const stats = [
    { icon: FiDownload, label: 'Projects', value: '45+' },
    { icon: FiUsers, label: 'Happy Users', value: '500+' },
    { icon: FiTrendingUp, label: 'Success Rate', value: '98%' },
  ];

  return (
    <>
      <HeroSection />

      {/* Stats Section */}
      <section className="w-full bg-gradient-to-b from-[#0b0e27] to-[#151a36] py-12 sm:py-16 md:py-20">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 sm:p-8 bg-[#151a36] border border-neon-cyan rounded-lg box-glow-cyan"
                >
                  <Icon className="text-neon-green mx-auto mb-4" size={40} />
                  <p className="text-text-light mb-2 text-sm sm:text-base">{stat.label}</p>
                  <p className="text-3xl sm:text-4xl font-bold neon-green-glow">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full py-16 sm:py-20 md:py-24">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 neon-glow">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                title: '✅ Complete Source Code',
                description: 'Get fully functional, production-ready code that you can run immediately',
              },
              {
                title: '📺 Video Tutorials',
                description: 'Detailed video walkthrough showing the entire project in action',
              },
              {
                title: '📚 Learning Resources',
                description: 'Comprehensive documentation, guides, and learning materials included',
              },
              {
                title: '🎓 Viva Questions',
                description: 'Prepare for technical interviews with curated viva questions',
              },
              {
                title: '⚡ Quick Setup',
                description: 'Step-by-step instructions to get the project running in minutes',
              },
              {
                title: '💬 Support',
                description: 'Get help via WhatsApp and email from our dedicated support team',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#151a36] border border-neon-green rounded-lg p-6 sm:p-8 box-glow-green"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-3 neon-green-glow">{item.title}</h3>
                <p className="text-text-light text-sm sm:text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#0a1628] via-[#1a0f3a] to-[#0f1b2e] border-t border-b border-neon-cyan border-opacity-30">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg" style={{textShadow: '0 0 30px rgba(0, 217, 255, 0.6), 0 0 60px rgba(2, 254, 136, 0.3)'}}>
              Ready to Get Started?
            </h2>
            <p className="text-white mb-8 text-lg sm:text-xl drop-shadow-md" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
              Browse our collection of production-ready projects and download them today!
            </p>
            <a href="/projects">
              <button className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all transform hover:scale-105 text-base sm:text-lg">
                Explore Projects Now →
              </button>
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
