import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuthStore } from '@/lib/store';
import { addRequest, updateProjectStats, getUserProfile, isProfileComplete } from '@/lib/db';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  projectPrice: number;
}

const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
  projectPrice,
}) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [profileComplete, setProfileComplete] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    collegeName: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');

  // Check profile completion when modal opens
  useEffect(() => {
    const checkProfile = async () => {
      if (!isOpen || !user) return;
      
      try {
        setCheckingProfile(true);
        const profileData = await getUserProfile(user.uid);
        const isComplete = await isProfileComplete(user.uid);
        
        if (isComplete && profileData) {
          setProfileComplete(true);
          setFormData({
            fullName: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            whatsapp: profileData.phone || '',
            collegeName: profileData.collegeName || '',
            message: '',
          });
        } else {
          setProfileComplete(false);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [isOpen, user]);

  const generateRequestId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const count = Math.floor(Math.random() * 10000);
    return `REQ-${year}-${String(count).padStart(4, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newRequestId = generateRequestId();
      
      console.log('Creating request with projectName:', projectName); // Debug log
      
      const requestData = {
        projectId,
        projectName: projectName || 'Project',
        amount: projectPrice,
        userName: formData.fullName,
        userEmail: user?.email || formData.email,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        collegeName: formData.collegeName || '',
        message: formData.message || '',
        requestId: newRequestId,
        status: 'pending',
        paymentStatus: 'not_paid',
      };

      console.log('Request data to send:', requestData); // Debug log

      await addRequest(requestData);
      await updateProjectStats(projectId, 'requests', 1);

      setRequestId(newRequestId);
      setSuccess(true);
    } catch (error: any) {
      console.error('Error submitting request:', error);
      
      // Check for blocked by client error
      if (error.message?.includes('blocked') || error.code?.includes('ERR_BLOCKED')) {
        alert('Request was blocked by your browser/extension. Please:\n1. Disable ad blockers\n2. Check firewall settings\n3. Try in incognito mode');
      } else {
        alert(`Error submitting request: ${error.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-8 max-w-md w-full box-glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-light hover:text-neon-green transition-colors"
        >
          <FiX size={24} />
        </button>

        {!success ? (
          <>
            <h2 className="text-2xl font-bold mb-2 neon-green-glow">Request Project</h2>
            <p className="text-text-light mb-6">{projectName}</p>

            {checkingProfile ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan mx-auto"></div>
              </div>
            ) : !profileComplete ? (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <FiAlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-yellow-300 font-semibold mb-3">Complete Your Profile First</p>
                    <p className="text-yellow-200 text-sm mb-4">We need your details to process your request. Fill your profile once and we'll auto-fill it for all future requests!</p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push('/profile');
                      }}
                      className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all"
                    >
                      Complete Profile Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
              />
              <input
                type="tel"
                name="whatsapp"
                placeholder="WhatsApp Number"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
              />
              <input
                type="text"
                name="collegeName"
                placeholder="College Name (Optional)"
                value={formData.collegeName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
              />
              <textarea
                name="message"
                placeholder="Your Message/Requirements (Optional)"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-4 neon-green-glow">Request Submitted!</h3>
            <p className="text-text-light mb-4">Your Request ID:</p>
            <div className="bg-[#0b0e27] border border-neon-green p-4 rounded-lg mb-6">
              <p className="text-2xl font-mono font-bold neon-green-glow">{requestId}</p>
            </div>
            <div className="bg-[#0b0e27] border border-neon-cyan rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-bold text-neon-cyan mb-3">📋 What Happens Next:</p>
              <ol className="text-sm text-text-light space-y-2 ml-4 list-decimal">
                <li>📧 Email notification sent to <strong>{formData.email}</strong></li>
                <li>💬 WhatsApp notification sent to <strong>{formData.whatsapp}</strong></li>
                <li>📝 Admin will send you payment details (UPI/Bank) via WhatsApp</li>
                <li>💳 Send payment of ₹{projectPrice} and screenshot via WhatsApp</li>
                <li>✨ We verify and grant access within 24 hours</li>
              </ol>
            </div>
            <p className="text-text-light text-sm mb-6 bg-[#151a36] p-3 rounded border border-neon-cyan">
              💡 Check your email & WhatsApp for further updates. Keep your Request ID safe!
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RequestModal;
