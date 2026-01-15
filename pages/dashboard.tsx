import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/router';
import { getRequestsByUserEmail, getProjectById } from '@/lib/db';
import Link from 'next/link';

interface Request {
  requestId: string;
  projectId: string;
  projectName: string;
  projectPrice: number;
  userName: string;
  userEmail: string;
  userWhatsApp: string;
  paymentStatus: string;
  downloadEnabled: boolean;
  transactionId?: string;
  createdAt: string;
  verifiedAt?: string;
}

export default function Dashboard() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user?.email) {
      fetchUserRequests();
    }
  }, [user, loading, router]);

  const fetchUserRequests = async () => {
    try {
      setLoadingRequests(true);
      const userRequests = await getRequestsByUserEmail(user?.email || '');
      // Map to ensure all required fields exist with defaults
      const mappedRequests = userRequests.map((req: any) => ({
        requestId: req.requestId || req.id || '',
        projectId: req.projectId || '',
        projectName: req.projectName || 'Unknown Project',
        projectPrice: req.projectPrice || 0,
        userName: req.userName || '',
        userEmail: req.userEmail || user?.email || '',
        userWhatsApp: req.userWhatsApp || '',
        paymentStatus: req.paymentStatus || 'pending',
        downloadEnabled: req.downloadEnabled || false,
        transactionId: req.transactionId,
        createdAt: req.createdAt || new Date().toISOString(),
        verifiedAt: req.verifiedAt,
        ...req,
      }));
      setRequests(mappedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'pending_verification':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not_paid':
        return 'Payment Pending';
      case 'pending_verification':
        return 'Awaiting Verification';
      case 'verified':
        return 'Approved ✓';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const stats = {
    totalRequests: requests.length,
    approvedRequests: requests.filter((r) => r.paymentStatus === 'verified').length,
    pendingRequests: requests.filter((r) => r.paymentStatus === 'not_paid' || r.paymentStatus === 'pending_verification').length,
    totalSpent: requests
      .filter((r) => r.paymentStatus === 'verified')
      .reduce((sum, r) => sum + r.projectPrice, 0),
  };

  const filteredRequests =
    selectedStatus === 'all'
      ? requests
      : requests.filter((r) => r.paymentStatus === selectedStatus);

  if (loading || loadingRequests) {
    return (
      <div className="min-h-screen w-full bg-[#0f0f1e] pt-20 pb-16 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#0f0f1e] pt-20 pb-16 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Welcome Back, {user.displayName || user.email?.split('@')[0]}!</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your project requests and downloads</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
          <div className="bg-[#1a1a2e] border border-[#2d3748] rounded-lg p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Total Requests</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalRequests}</p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#2d3748] rounded-lg p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Approved</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">{stats.approvedRequests}</p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#2d3748] rounded-lg p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Pending</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.pendingRequests}</p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#2d3748] rounded-lg p-4 sm:p-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Total Spent</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-400">₹{stats.totalSpent}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm sm:text-base ${
              selectedStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-[#1a1a2e] text-gray-400 border border-[#2d3748] hover:border-blue-500'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setSelectedStatus('verified')}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm sm:text-base ${
              selectedStatus === 'verified'
                ? 'bg-green-600 text-white'
                : 'bg-[#1a1a2e] text-gray-400 border border-[#2d3748] hover:border-green-500'
            }`}
          >
            Approved ({stats.approvedRequests})
          </button>
          <button
            onClick={() => setSelectedStatus('not_paid')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedStatus === 'not_paid'
                ? 'bg-yellow-600 text-white'
                : 'bg-[#1a1a2e] text-gray-400 border border-[#2d3748] hover:border-yellow-500'
            }`}
          >
            Not Paid
          </button>
          <button
            onClick={() => setSelectedStatus('pending_verification')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedStatus === 'pending_verification'
                ? 'bg-orange-600 text-white'
                : 'bg-[#1a1a2e] text-gray-400 border border-[#2d3748] hover:border-orange-500'
            }`}
          >
            Pending
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-[#1a1a2e] border border-[#2d3748] rounded-lg overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 mb-4">No requests found in this category</p>
              <Link href="/projects">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  Browse Projects
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f0f1e] border-b border-[#2d3748]">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Request ID</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Project Name</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.requestId} className="border-b border-[#2d3748] hover:bg-[#252541] transition-all">
                      <td className="px-6 py-4 text-white text-sm font-mono">{request.requestId}</td>
                      <td className="px-6 py-4 text-white text-sm">{request.projectName}</td>
                      <td className="px-6 py-4 text-white text-sm font-semibold">₹{request.projectPrice}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.paymentStatus)}`}>
                          {getStatusLabel(request.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {request.downloadEnabled ? (
                          <a
                            href={`/api/download/${request.projectId}`}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-all inline-block"
                          >
                            Download
                          </a>
                        ) : request.paymentStatus === 'not_paid' ? (
                          <Link href="/track">
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-all">
                              Pay Now
                            </button>
                          </Link>
                        ) : (
                          <span className="text-gray-500 text-xs">Processing...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Info */}
          <div className="bg-[#1a1a2e] border border-[#2d3748] rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
              {user.displayName && (
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white">{user.displayName}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm">Account Created</p>
                <p className="text-white">{new Date(user.metadata?.creationTime || '').toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1a1a2e] border border-[#2d3748] rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/projects">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-left font-semibold">
                  Browse Projects →
                </button>
              </Link>
              <Link href="/track">
                <button className="w-full px-4 py-2 bg-[#2d3748] text-white rounded-lg hover:bg-[#3d4758] transition-all text-left font-semibold">
                  Track Requests →
                </button>
              </Link>
              <button
                onClick={() => {
                  router.push('/login?action=logout');
                }}
                className="w-full px-4 py-2 bg-[#2d3748] text-white rounded-lg hover:bg-[#3d4758] transition-all text-left font-semibold"
              >
                Logout →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
