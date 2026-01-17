import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiPlay } from 'react-icons/fi';
import Breadcrumbs from '@/components/Breadcrumbs';
import RequestModal from '@/components/RequestModal';
import { getProjects, incrementProjectViews } from '@/lib/db';

const Projects = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Web Development', 'Mobile Apps', 'Machine Learning', 'DevOps'];

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    
    let videoId = '';
    
    // Handle youtube.com/watch?v=... format
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    }
    // Handle youtu.be/... format
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || '';
    }
    // Handle youtube.com/embed/... format
    else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    // Handle just video ID
    else if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
      videoId = url;
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&mute=1`;
    }
    
    // If not YouTube, return URL as is (for video files)
    return url;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.tags && Array.isArray(p.tags) && p.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedCategory, projects]);

  const handleProjectClick = async (project: any) => {
    try {
      await incrementProjectViews(project.id);
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const handleRequestClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b0e27] via-[#151a36] to-[#0b0e27] py-8 sm:py-12 md:py-16">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Breadcrumbs */}
        <div className="mb-6 sm:mb-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects' }]} />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 neon-glow">Browse Projects</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6 sm:mb-8">
            <input
              type="text"
              placeholder="Search projects by name, tech stack, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-[#151a36] border-2 border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green transition-all pl-12"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan" size={20} />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 sm:gap-3 flex-wrap overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat.toLowerCase().replace(' ', '-').replace(' ', '-'))}
                className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                  selectedCategory === cat.toLowerCase().replace(' ', '-').replace(' ', '-')
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-black box-glow-cyan'
                    : 'bg-[#151a36] border border-neon-cyan text-text-light hover:text-neon-green'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
          </div>
        ) : (
          <>
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-[#151a36] border border-neon-cyan rounded-lg overflow-hidden box-glow-cyan cursor-pointer group"
                  >
                    {/* Card Header - Video Trailer */}
                    <div className="h-40 bg-gradient-to-br from-neon-cyan to-neon-green opacity-20 flex items-center justify-center group-hover:opacity-30 transition-all relative overflow-hidden">
                      {project.trailer ? (
                        project.trailer.includes('youtube.com') || project.trailer.includes('youtu.be') ? (
                          <iframe
                            className="w-full h-full border-0"
                            src={getYouTubeEmbedUrl(project.trailer)}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <video
                            className="w-full h-full object-cover"
                            muted
                            loop
                            autoPlay
                            playsInline
                          >
                            <source src={project.trailer} type="video/mp4" />
                          </video>
                        )
                      ) : (
                        <div className="text-center">
                          <p className="text-4xl font-bold neon-glow">{project.name.charAt(0)}</p>
                          <p className="text-neon-green text-sm">{project.category}</p>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 neon-green-glow line-clamp-2">
                        {project.name}
                      </h3>
                      <p className="text-text-light text-sm mb-4 line-clamp-2">
                        {project.shortDescription}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(Array.isArray(project.techStack) 
                          ? project.techStack 
                          : (project.techStack || '').split(',').map((t: string) => t.trim()).filter((t: string) => t)
                        ).slice(0, 3).map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-[#0b0e27] border border-neon-cyan text-neon-cyan text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {(Array.isArray(project.techStack) 
                          ? project.techStack 
                          : (project.techStack || '').split(',').map((t: string) => t.trim()).filter((t: string) => t)
                        ).length > 3 && (
                          <span className="px-3 py-1 bg-[#0b0e27] border border-neon-green text-neon-green text-xs rounded-full">
                            +{(Array.isArray(project.techStack) 
                              ? project.techStack 
                              : (project.techStack || '').split(',').map((t: string) => t.trim()).filter((t: string) => t)
                            ).length - 3}
                          </span>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-3 mb-4">
                        {project.discountedPrice ? (
                          <>
                            <span className="text-xl font-bold neon-green-glow">₹{project.discountedPrice}</span>
                            <span className="text-sm text-text-light line-through">₹{project.price}</span>
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                              {Math.round(((project.price - project.discountedPrice) / project.price) * 100)}% OFF
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold neon-green-glow">₹{project.price}</span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4 text-xs text-text-light mb-4 border-t border-neon-cyan pt-4">
                        <div>👁️ {project.views || 0} views</div>
                        <div>📊 {project.requests || 0} requests</div>
                        <div>✅ {project.sales || 0} sales</div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            console.log('Project ID:', project.id);
                            console.log('Full project:', project);
                            if (project.id) {
                              router.push(`/project/${project.id}`);
                            } else {
                              alert('Project ID not found!');
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-all font-semibold"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleRequestClick(project)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all"
                        >
                          Request
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl text-text-light">No projects found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Request Modal */}
      {selectedProject && (
        <RequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          projectPrice={selectedProject.discountedPrice}
        />
      )}
    </div>
  );
};

export default Projects;
