import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getRequestByRequestId } from '@/lib/db';
import { FiSearch } from 'react-icons/fi';

const TrackRequest = () => {
  const [searchInput, setSearchInput] = useState('');
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError('Please enter a Request ID or Email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await getRequestByRequestId(searchInput);
      if (result) {
        setRequest(result);
      } else {
        setError('Request not found. Please check your Request ID or Email.');
        setRequest(null);
      }
    } catch (err) {
      setError('Error searching for request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'details_sent':
        return 'bg-blue-500';
      case 'screenshot_submitted':
        return 'bg-purple-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'not_paid':
        return 'text-yellow-500';
      case 'pending_verification':
        return 'text-blue-500';
      case 'verified':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0e27] via-[#151a36] to-[#0b0e27] py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 neon-glow">Track Your Request</h1>
          <p className="text-text-light text-lg">
            Enter your Request ID to check the status of your project request
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-8 box-glow-cyan mb-8"
        >
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Request ID (e.g., REQ-2026-0001)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-6 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <FiSearch size={20} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </motion.div>

        {/* Request Details */}
        {request && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Overview */}
            <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-8 box-glow-cyan">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-text-light text-sm mb-1">Request ID</p>
                  <p className="text-3xl font-bold neon-green-glow">{request.requestId}</p>
                </div>
                <div className={`${getStatusColor(request.status)} text-white px-6 py-3 rounded-lg font-bold`}>
                  {request.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-light text-sm">Project</p>
                  <p className="text-lg font-semibold neon-cyan-glow">{request.projectName}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Amount</p>
                  <p className="text-lg font-semibold neon-green-glow">₹{request.amount}</p>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="bg-[#151a36] border border-neon-green rounded-lg p-6 box-glow-green">
              <h3 className="text-xl font-bold mb-4 neon-green-glow">User Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-text-light text-sm">Full Name</p>
                  <p className="font-semibold">{request.userName}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Email</p>
                  <p className="font-semibold">{request.email}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Phone</p>
                  <p className="font-semibold">{request.phone}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">WhatsApp</p>
                  <p className="font-semibold">{request.whatsapp}</p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-[#151a36] border border-neon-cyan rounded-lg p-6 box-glow-cyan">
              <h3 className="text-xl font-bold mb-4 neon-cyan-glow">Payment Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-text-light">Status:</p>
                  <p className={`font-bold ${getPaymentStatusColor(request.paymentStatus)}`}>
                    {request.paymentStatus.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
                {request.transactionId && (
                  <div className="flex items-center justify-between">
                    <p className="text-text-light">Transaction ID:</p>
                    <p className="font-mono text-neon-green font-bold">{request.transactionId}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-text-light">Download Enabled:</p>
                  <p className={request.downloadEnabled ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                    {request.downloadEnabled ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6 pt-6 border-t border-neon-cyan">
                <h4 className="font-bold mb-4 neon-green-glow">Timeline</h4>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-neon-green mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">Request Submitted</p>
                      <p className="text-text-light text-sm">
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {request.paymentStatus === 'verified' && (
                    <div className="flex gap-4">
                      <div className="w-3 h-3 rounded-full bg-neon-cyan mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold">✅ Payment Verified</p>
                        <p className="text-text-light text-sm">
                          {new Date(request.verifiedAt || request.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {request.paymentStatus === 'rejected' && (
                    <div className="flex gap-4">
                      <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold">❌ Payment Rejected</p>
                        <p className="text-text-light text-sm">
                          {new Date(request.rejectedAt || request.updatedAt).toLocaleString()}
                        </p>
                        <p className="text-text-light text-xs mt-2">Please contact support for more details</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-[#0b0e27] border-2 border-neon-cyan rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 neon-cyan-glow">📋 Payment Instructions</h3>
              {request.paymentStatus === 'not_paid' && (
                <div className="space-y-3 text-text-light">
                  <p>Payment not yet received. Here's what to do:</p>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>We've sent payment details to your email and WhatsApp</li>
                    <li>Send the required amount via your preferred payment method (UPI, Bank Transfer, etc.)</li>
                    <li>Take a screenshot of the transaction receipt</li>
                    <li>Send the screenshot to our admin via WhatsApp</li>
                    <li>Admin will verify and enable your download within 24 hours</li>
                  </ol>
                </div>
              )}
              {request.paymentStatus === 'pending_verification' && (
                <div className="space-y-3 text-text-light">
                  <p className="text-neon-cyan font-bold">⏳ Payment Verification in Progress</p>
                  <p>We've received your payment screenshot and are verifying it.</p>
                  <p>You'll receive a notification once payment is verified (typically within 24 hours).</p>
                </div>
              )}
              {request.paymentStatus === 'verified' && (
                <div className="space-y-3 text-text-light">
                  <p className="text-neon-green font-bold">✅ Payment Verified!</p>
                  <p>Your payment has been confirmed. Download link is now available below.</p>
                </div>
              )}
              {request.paymentStatus === 'rejected' && (
                <div className="space-y-3 text-text-light">
                  <p className="text-red-400 font-bold">❌ Payment Could Not Be Verified</p>
                  <p>We couldn't verify your payment. Please contact admin support for assistance.</p>
                  <p className="text-sm">You can retry by sending the correct transaction details.</p>
                </div>
              )}
            </div>

            {/* Download Section */}
            {request.downloadEnabled && (
              <div className="bg-gradient-to-r from-neon-green to-neon-cyan bg-opacity-10 border-2 border-neon-green rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 neon-green-glow">✅ Your Project is Ready!</h3>
                <p className="text-text-light mb-6">
                  Click the button below to download your project files:
                </p>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-bold rounded-lg hover:shadow-neon-glow transition-all text-lg">
                  📥 Download Project Files
                </button>
              </div>
            )}

            {/* Message */}
            {request.message && (
              <div className="bg-[#151a36] border border-neon-cyan rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2 neon-cyan-glow">Your Message</h3>
                <p className="text-text-light">{request.message}</p>
              </div>
            )}

            {/* Support */}
            <div className="bg-[#151a36] border border-neon-green rounded-lg p-6 box-glow-green text-center">
              <h3 className="font-bold mb-3 neon-green-glow">Need Help?</h3>
              <p className="text-text-light mb-4">Contact our support team for any queries:</p>
              <div className="flex flex-col gap-2">
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:text-neon-cyan transition-colors">
                  📱 WhatsApp: +91 98765 43210
                </a>
                <a href="mailto:support@projects4you.com" className="text-neon-green hover:text-neon-cyan transition-colors">
                  📧 Email: support@projects4you.com
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackRequest;
