import api from './api';

// Mock data for development until backend is ready
const mockProjects = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Complete website redesign for client XYZ to improve user experience and conversion rates.',
    clientName: 'XYZ Corporation',
    clientEmail: 'client@xyz.com',
    completionPercentage: 30,
    createdAt: '2023-07-10'
  },
  {
    id: 'project-2',
    name: 'Marketing Campaign',
    description: 'Digital marketing campaign to increase brand awareness and lead generation.',
    clientName: 'ABC Inc',
    clientEmail: 'marketing@abc.com',
    completionPercentage: 75,
    createdAt: '2023-07-05'
  }
];

export const projectService = {
  // Get all projects for the current user
  async getUserProjects() {
    try {
      // Uncomment when backend is ready
      // const response = await api.get('/projects');
      // return response.data.data;

      // Return mock data for now
      return Promise.resolve(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error.response?.data?.error || 'Failed to fetch projects';
    }
  },

  // Get a specific project
  async getProject(projectId) {
    try {
      // Uncomment when backend is ready
      // const response = await api.get(`/projects/${projectId}`);
      // return response.data.data;

      // Return mock data for now
      const project = mockProjects.find(p => p.id === projectId);
      if (!project) {
        throw new Error('Project not found');
      }
      return Promise.resolve(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error.response?.data?.error || error.message || 'Failed to fetch project';
    }
  },

  // Create a new project
  async createProject(projectData) {
    try {
      // Uncomment when backend is ready
      // const response = await api.post('/projects', projectData);
      // return response.data.data;

      // Create mock project for now
      const newProject = {
        id: `project-${mockProjects.length + 1}`,
        ...projectData,
        completionPercentage: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Add to mock projects list
      mockProjects.push(newProject);

      return Promise.resolve(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error.response?.data?.error || 'Failed to create project';
    }
  }
};
