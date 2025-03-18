import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import { Plus, ChevronRight } from 'lucide-react';
import { projectService } from '../../services/projectService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getUserProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Welcome Header */}
        <div className="p-8">
          <h1 className="text-2xl font-medium text-gray-800">Welcome to Build Digital Growth, {currentUser?.fullName || 'User'}</h1>
        </div>

        {/* Launchpad Section */}
        <div className="px-8 pb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl overflow-hidden shadow-lg">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to grow your digital presence?</h2>
              <p className="text-yellow-50 text-lg mb-8">
                Our team of experts will help you build a strategy tailored to your business goals.
                Get started with your first project today.
              </p>
              <button
                onClick={handleCreateProject}
                className="bg-white text-yellow-600 hover:bg-yellow-50 font-medium rounded-lg px-6 py-3 shadow-md transition duration-200 flex items-center justify-center"
              >
                <Plus className="mr-2" size={18} />
                Start a Project
              </button>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {projects.length > 0 ? (
          <div className="px-8 pb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-800">Your Projects</h2>
              <button
                onClick={() => navigate('/projects')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View All
                <ChevronRight className="ml-1" size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>

                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${project.completionPercentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 text-right">
                        {project.completionPercentage || 0}% complete
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !loading && (
          <div className="px-8 pb-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't created any projects yet. Start your first project to begin tracking your digital growth journey.
              </p>
              <button
                onClick={handleCreateProject}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg px-6 py-3 transition duration-200 inline-flex items-center"
              >
                <Plus className="mr-2" size={18} />
                Create Your First Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
