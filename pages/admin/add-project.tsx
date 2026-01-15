import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import { addProject } from '@/lib/db';
import { useRouter } from 'next/router';

const AddProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    techStack: '',
    generalPrice: '',
    discountedPrice: '',
    shortDescription: '',
    fullSynopsis: '',
    features: '',
    githubLink: '',
    youtubeLink: '',
    learningResourcesLink: '',
    vivaQuestionsLink: '',
    howToRun: '',
    difficulty: 'intermediate',
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const projectData = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        techStack: formData.techStack.split(',').map((tech) => tech.trim()),
        price: parseFloat(formData.generalPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
        shortDescription: formData.shortDescription,
        fullSynopsis: formData.fullSynopsis,
        features: formData.features.split('\n').map((feat) => feat.trim()),
        githubLink: formData.githubLink,
        youtubeLink: formData.youtubeLink,
        learningResourcesLink: formData.learningResourcesLink,
        vivaQuestionsLink: formData.vivaQuestionsLink || '',
        howToRun: formData.howToRun,
        difficulty: formData.difficulty,
        tags: formData.tags.split(',').map((tag) => tag.trim()),
        status: 'active',
      };

      await addProject(projectData);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Error adding project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e27] py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Add Project' }]} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold neon-glow mb-2">Add New Project</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-6 box-glow-cyan">
            <h2 className="text-2xl font-bold neon-cyan-glow mb-4">Basic Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green"
                >
                  <option>Select Category</option>
                  <option>Web Development</option>
                  <option>Mobile Apps</option>
                  <option>Machine Learning</option>
                  <option>DevOps</option>
                  <option>Data Science</option>
                </select>

                <input
                  type="text"
                  name="subcategory"
                  placeholder="Subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green"
                />
              </div>

              <textarea
                name="shortDescription"
                placeholder="Short Description (1-2 lines)"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#151a36] border-2 border-neon-green rounded-lg p-6 box-glow-green">
            <h2 className="text-2xl font-bold neon-green-glow mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                placeholder="General Price (₹)"
                value={formData.generalPrice}
                onChange={handleChange}
                required
                className="px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              />
              <input
                type="number"
                name="discountedPrice"
                placeholder="Discounted Price (₹)"
                value={formData.discountedPrice}
                onChange={handleChange}
                required
                className="px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              />
            </div>
          </div>

          {/* Tech Stack & Tags */}
          <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-6 box-glow-cyan">
            <h2 className="text-2xl font-bold neon-cyan-glow mb-4">Tech Stack & Tags</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="techStack"
                placeholder="Tech Stack (comma-separated: React, Node.js, MongoDB)"
                value={formData.techStack}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green"
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma-separated: ecommerce, payment, fullstack)"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green"
              />
            </div>
          </div>

          {/* Description & Features */}
          <div className="bg-[#151a36] border-2 border-neon-green rounded-lg p-6 box-glow-green">
            <h2 className="text-2xl font-bold neon-green-glow mb-4">Description & Features</h2>
            <div className="space-y-4">
              <textarea
                name="fullSynopsis"
                placeholder="Full Synopsis / Description"
                value={formData.fullSynopsis}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              />
              <textarea
                name="features"
                placeholder="Features (one per line)"
                value={formData.features}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              />
            </div>
          </div>

          {/* Links */}
          <div className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-6 box-glow-cyan">
            <h2 className="text-2xl font-bold neon-cyan-glow mb-4">Resource Links</h2>
            <div className="space-y-4">
              <input
                type="url"
                name="githubLink"
                placeholder="GitHub ZIP Link"
                value={formData.githubLink}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green"
              />
              <input
                type="url"
                name="youtubeLink"
                placeholder="YouTube Demo Link"
                value={formData.youtubeLink}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green"
              />
              <input
                type="url"
                name="learningResourcesLink"
                placeholder="Learning Resources Link (Google Drive)"
                value={formData.learningResourcesLink}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green"
              />
              <input
                type="url"
                name="vivaQuestionsLink"
                placeholder="Viva Questions Link (Optional)"
                value={formData.vivaQuestionsLink}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green"
              />
            </div>
          </div>

          {/* How to Run & Difficulty */}
          <div className="bg-[#151a36] border-2 border-neon-green rounded-lg p-6 box-glow-green">
            <h2 className="text-2xl font-bold neon-green-glow mb-4">Setup & Difficulty</h2>
            <div className="space-y-4">
              <textarea
                name="howToRun"
                placeholder="How to Run Instructions (Prerequisites, Steps, Troubleshooting)"
                value={formData.howToRun}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              />
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-green rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all disabled:opacity-50 text-lg"
          >
            {loading ? 'Adding Project...' : 'Add Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
