import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiX, FiAlertCircle } from 'react-icons/fi';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getProjects, updateProject, deleteProject } from '@/lib/db';
import { useAuthStore } from '@/lib/store';

interface Project {
  id: string;
  name: string;
  category: string;
  price: number;
  discountedPrice?: number;
  views: number;
  requests: number;
  createdAt: string;
  [key: string]: any;
}

export default function ManageProjects() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (user?.email?.includes('admin')) {
      setIsAdmin(true);
    } else {
      router.push('/projects');
      return;
    }
    loadProjects();
  }, [user, router]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      // Filter and map data to ensure all required fields exist
      const projects = data.map((doc: any) => ({
        id: doc.id || '',
        name: doc.name || 'Unnamed Project',
        category: doc.category || 'Other',
        price: doc.price || 0,
        discountedPrice: doc.discountedPrice,
        views: doc.views || 0,
        requests: doc.requests || 0,
        createdAt: doc.createdAt || new Date().toISOString(),
        ...doc,
      }));
      setProjects(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setMessage('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditing(project.id);
    setEditData(project);
  };

  const handleSave = async () => {
    if (!editing) return;

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

      await updateProject(editing, updates);

      setMessage('Project updated successfully');
      setEditing(null);
      loadProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating project:', error);
      setMessage('Failed to update project');
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setMessage('Project deleted successfully');
      setDeleting(null);
      loadProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting project:', error);
      setMessage('Failed to delete project');
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e27] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e27] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Manage Projects' }]} />
        </div>

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-neon-cyan">Manage Projects</h1>
        <p className="text-text-light mb-8">Edit or delete your projects</p>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('Failed') ? 'bg-red-500/20 border border-red-500' : 'bg-green-500/20 border border-green-500'}`}>
            {message}
          </div>
        )}

        {/* Projects Table */}
        <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg overflow-hidden box-glow-cyan">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0b0e27] border-b-2 border-neon-cyan">
                <tr>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-bold">Project Name</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-bold">Category</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-bold">Price</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-bold">Views</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-bold">Requests</th>
                  <th className="px-4 py-3 text-center text-xs sm:text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-text-light">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="border-b border-neon-green/30 hover:bg-[#0b0e27] transition-colors">
                      <td className="px-4 py-3 text-xs sm:text-sm">{project.name}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm">{project.category}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm">
                        ₹{project.price}
                        {project.discountedPrice && <span className="text-neon-green"> (₹{project.discountedPrice})</span>}
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm">{project.views}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm">{project.requests}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEdit(project)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded hover:bg-neon-cyan hover:text-black transition-all text-xs sm:text-sm mr-2"
                        >
                          <FiEdit2 size={14} />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleting(project.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all text-xs sm:text-sm"
                        >
                          <FiTrash2 size={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditing(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-8 max-w-2xl w-full box-glow-cyan my-8 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditing(null)}
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
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Category *</label>
                  <input
                    type="text"
                    value={editData.category}
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
                    value={editData.price}
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
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Tech Stack (comma separated or single)</label>
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
                  placeholder="https://youtu.be/..."
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Trailer Link</label>
                <input
                  type="url"
                  value={editData.trailer || ''}
                  onChange={(e) => setEditData({ ...editData, trailer: e.target.value })}
                  placeholder="https://youtu.be/..."
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Project Link (GitHub/Live)</label>
                <input
                  type="url"
                  value={editData.projectLink || ''}
                  onChange={(e) => setEditData({ ...editData, projectLink: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Download Link</label>
                <input
                  type="url"
                  value={editData.downloadLink || ''}
                  onChange={(e) => setEditData({ ...editData, downloadLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-text-light text-xs sm:text-sm font-semibold mb-2">Viva Questions</label>
                <textarea
                  value={editData.vivaQuestions || ''}
                  onChange={(e) => setEditData({ ...editData, vivaQuestions: e.target.value })}
                  rows={2}
                  placeholder="1. Question one 2. Question two"
                  className="w-full px-4 py-2 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6 pt-4 border-t border-neon-cyan">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 px-4 py-2 bg-[#0b0e27] border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-all font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all text-sm"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {deleting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleting(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#151a36] border-2 border-red-500 rounded-lg p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <FiAlertCircle size={32} className="text-red-500" />
              <h2 className="text-2xl font-bold text-red-500">Delete Project</h2>
            </div>

            <p className="text-text-light mb-6">
              Are you sure you want to delete <strong>{projects.find((p) => p.id === deleting)?.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 px-4 py-2 bg-[#0b0e27] border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-all font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleting)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-bold"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
