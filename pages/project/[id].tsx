import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlay, FiChevronDown, FiChevronUp, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import RequestModal from '@/components/RequestModal';
import { getProjectById, incrementProjectViews, deleteProject, updateProject } from '@/lib/db';
import { useAuthStore } from '@/lib/store';

const ProjectDetails = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { id } = router.query;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    resources: false,
    questions: false,
  });

  useEffect(() => {
    // Check if user is admin
    if (user?.email?.includes('admin')) {
      setIsAdmin(true);
    }
  }, [user]);

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    let videoId = '';
    
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`;
    }
    
    return url;
  };

  const handleDeleteProject = async () => {
    if (!isAdmin) return;

    setIsDeleting(true);
    try {
      await deleteProject(id as string);
      router.push('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  };

  const handleEditClick = () => {
    setEditData({ ...project });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!isAdmin || !project) return;

    setIsSaving(true);
    try {
      const updates = {
        name: editData.name,
        category: editData.category,
        price: parseInt(editData.price),
        discountedPrice: editData.discountedPrice ? parseInt(editData.discountedPrice) : null,
        shortDescription: editData.shortDescription,
        description: editData.description,
        synopsis: editData.synopsis,
        techStack: editData.techStack,
        youtubeDemo: editData.youtubeDemo,
        trailer: editData.trailer,
        projectLink: editData.projectLink,
        downloadLink: editData.downloadLink,
        vivaQuestions: editData.vivaQuestions,
      };

      await updateProject(project.id, updates);
      setProject({ ...project, ...updates });
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const data = await getProjectById(id as string);
        if (data) {
          setProject(data);
          // Try to increment views, but don't fail if user is not authenticated
          try {
            await incrementProjectViews(id as string);
          } catch (viewError) {
            // Silently ignore view increment errors
          }
        } else {
          router.push('/projects');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e27] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0b0e27] flex items-center justify-center">
        <p className="text-2xl text-text-light">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b0e27] via-[#151a36] to-[#0b0e27] py-4 sm:py-6">
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors mb-4"
        >
          <FiArrowLeft size={18} />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 sm:space-y-4"
        >
          {/* Header - Compact */}
          <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-3 sm:p-4 box-glow-cyan">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold neon-green-glow mb-1">{project.name}</h1>
            <p className="text-text-light text-xs sm:text-sm mb-3">{project.synopsis || project.shortDescription}</p>
            
            {/* Badges Row */}
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="px-3 py-1 bg-neon-cyan text-black font-bold rounded-full text-xs">
                {project.category}
              </span>
              {project.discountedPrice ? (
                <>
                  <span className="px-3 py-1 bg-neon-green text-black font-bold rounded-full text-xs">
                    ₹{project.discountedPrice}
                  </span>
                  <span className="px-3 py-1 bg-[#0b0e27] border border-text-light text-text-light line-through rounded-full text-xs">
                    ₹{project.price}
                  </span>
                  <span className="px-3 py-1 bg-red-500 text-white font-bold rounded-full text-xs">
                    {Math.round(((project.price - project.discountedPrice) / project.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="px-3 py-1 bg-neon-green text-black font-bold rounded-full text-xs">
                  ₹{project.price}
                </span>
              )}
            </div>

            {/* Buttons Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {project.youtubeDemo && (
                <button
                  onClick={() => window.open(project.youtubeDemo, '_blank')}
                  className="flex items-center justify-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all text-xs sm:text-sm"
                >
                  <FiPlay size={14} />
                  Demo
                </button>
              )}
              {project.projectLink && (
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-2 sm:px-3 py-2 bg-[#151a36] border-2 border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-all font-bold text-xs sm:text-sm"
                >
                  Code
                </a>
              )}
              {project.downloadLink && (
                <a
                  href={project.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-2 sm:px-3 py-2 bg-[#151a36] border-2 border-neon-green text-neon-green rounded-lg hover:bg-neon-green hover:text-black transition-all font-bold text-xs sm:text-sm"
                >
                  Download
                </a>
              )}
              <button
                onClick={() => setIsModalOpen(true)}
                className="col-span-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all text-xs sm:text-sm"
              >
                Request
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="col-span-1 px-2 sm:px-3 py-2 bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <FiEdit2 size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="col-span-1 px-2 sm:px-3 py-2 bg-red-500/20 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <FiTrash2 size={14} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Left Column - 3 columns wide */}
            <div className="md:col-span-3 space-y-3 sm:space-y-4">
              {/* Description - Collapsible */}
              <div className="bg-[#151a36] border border-neon-green rounded-lg box-glow-green overflow-hidden">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between bg-[#0b0e27] hover:bg-[#151a36] transition-all"
                >
                  <h2 className="text-xs sm:text-sm font-bold neon-green-glow">📋 Description</h2>
                  {expandedSections.description ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </button>
                {expandedSections.description && (
                  <div className="p-3 sm:p-4 text-text-light text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-neon-green">
                    {project.description}
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              <div className="bg-[#151a36] border border-neon-cyan rounded-lg p-3 sm:p-4 box-glow-cyan">
                <h2 className="text-xs sm:text-sm font-bold neon-cyan-glow mb-2">⚙️ Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(project.techStack) 
                    ? project.techStack 
                    : (project.techStack || '').split(',').map((t: string) => t.trim()).filter((t: string) => t)
                  ).map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-[#0b0e27] border border-neon-cyan text-neon-cyan rounded-full font-semibold text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning Resources - Collapsible */}
              {project.learningResources && (
                <div className="bg-[#151a36] border border-neon-green rounded-lg box-glow-green overflow-hidden">
                  <button
                    onClick={() => toggleSection('resources')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between bg-[#0b0e27] hover:bg-[#151a36] transition-all"
                  >
                    <h2 className="text-xs sm:text-sm font-bold neon-green-glow">📚 Resources</h2>
                    {expandedSections.resources ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  </button>
                  {expandedSections.resources && (
                    <ul className="p-3 sm:p-4 space-y-1 text-text-light text-xs sm:text-sm border-t border-neon-green">
                      {(project.learningResources || '').split('\n').filter((line: string) => line.trim()).map((resource: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-neon-green mt-0.5">•</span>
                          <span>{resource.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Interview Questions - Collapsible */}
              {project.vivaQuestions && (
                <div className="bg-[#151a36] border border-neon-cyan rounded-lg box-glow-cyan overflow-hidden">
                  <button
                    onClick={() => toggleSection('questions')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between bg-[#0b0e27] hover:bg-[#151a36] transition-all"
                  >
                    <h2 className="text-xs sm:text-sm font-bold neon-cyan-glow">❓ Viva Questions</h2>
                    {expandedSections.questions ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  </button>
                  {expandedSections.questions && (
                    <ol className="p-3 sm:p-4 space-y-1 text-text-light text-xs sm:text-sm ml-4 list-decimal border-t border-neon-cyan">
                      {(project.vivaQuestions || '').split('\n').filter((line: string) => line.trim()).map((question: string, idx: number) => (
                        <li key={idx} className="ml-2">
                          {question.trim()}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Sidebar (1 column wide) */}
            <div className="space-y-3 sm:space-y-4">
              {/* Quick Info Box */}
              <div className="bg-[#151a36] border border-neon-cyan rounded-lg p-3 box-glow-cyan sticky top-4">
                <h3 className="text-xs sm:text-sm font-bold neon-cyan-glow mb-3">📌 Quick Info</h3>
                <div className="space-y-2 text-xs text-text-light">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-bold text-neon-green">₹{project.discountedPrice || project.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-bold text-neon-cyan text-right line-clamp-2">{project.category}</span>
                  </div>
                  {project.discountedPrice && (
                    <div className="flex justify-between">
                      <span>Save:</span>
                      <span className="font-bold text-red-400">₹{project.price - project.discountedPrice}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Box */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-3 py-2 sm:py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all text-xs sm:text-sm"
              >
                Request This Project
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-8 max-w-2xl w-full box-glow-cyan my-8 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-text-light hover:text-neon-green"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-neon-cyan">Edit Project</h2>

            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Category *</label>
                  <input
                    type="text"
                    value={editData.category || ''}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={editData.price || ''}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={editData.discountedPrice || ''}
                    onChange={(e) => setEditData({ ...editData, discountedPrice: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Short Description</label>
                <textarea
                  value={editData.shortDescription || ''}
                  onChange={(e) => setEditData({ ...editData, shortDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Full Description</label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Synopsis</label>
                <textarea
                  value={editData.synopsis || ''}
                  onChange={(e) => setEditData({ ...editData, synopsis: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Tech Stack</label>
                <input
                  type="text"
                  value={editData.techStack || ''}
                  onChange={(e) => setEditData({ ...editData, techStack: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              {/* Links */}
              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">YouTube Demo Link</label>
                <input
                  type="url"
                  value={editData.youtubeDemo || ''}
                  onChange={(e) => setEditData({ ...editData, youtubeDemo: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Trailer Link</label>
                <input
                  type="url"
                  value={editData.trailer || ''}
                  onChange={(e) => setEditData({ ...editData, trailer: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Project Link (GitHub/Live)</label>
                <input
                  type="url"
                  value={editData.projectLink || ''}
                  onChange={(e) => setEditData({ ...editData, projectLink: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Download Link</label>
                <input
                  type="url"
                  value={editData.downloadLink || ''}
                  onChange={(e) => setEditData({ ...editData, downloadLink: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Viva Questions</label>
                <textarea
                  value={editData.vivaQuestions || ''}
                  onChange={(e) => setEditData({ ...editData, vivaQuestions: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6 pt-4 border-t border-neon-cyan">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-[#0b0e27] border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-all font-bold text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all text-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#151a36] border-2 border-red-500 rounded-lg p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-red-500 mb-4">Delete Project</h2>
            <p className="text-text-light mb-6">
              Are you sure you want to delete <strong>{project.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-[#0b0e27] border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-all font-bold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-bold disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Request Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id}
        projectName={project.name}
        projectPrice={project.discountedPrice || project.price || 0}
      />
    </div>
  );
};

export default ProjectDetails;
