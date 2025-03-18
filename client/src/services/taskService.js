import api from './api';

export const taskService = {
  // Get all tasks for a project
  async getProjectTasks(projectId) {
    try {
      // Uncomment when backend is ready
      // const response = await api.get(`/projects/${projectId}/tasks`);
      // return response.data.data;

      // Return mock data for now
      return Promise.resolve([
        { id: 'task-1', title: 'Add Staging Site to WP Engine', status: 'todo' },
        { id: 'task-2', title: 'Add Hello Elementor Theme', status: 'todo' },
        { id: 'task-3', title: 'Add Core Plugins', status: 'todo' },
        { id: 'task-4', title: 'Develop Homepage/Header/Footer', status: 'todo' },
        { id: 'task-5', title: 'Develop Inner Pages + Any Templates', status: 'todo' }
      ]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error.response?.data?.error || 'Failed to fetch tasks';
    }
  },

  // Get a specific task
  async getTask(taskId) {
    try {
      // Uncomment when backend is ready
      // const response = await api.get(`/tasks/${taskId}`);
      // return response.data.data;

      // Return mock data for now
      return Promise.resolve({
        id: taskId,
        title: 'Task Title',
        description: 'Task description would go here.',
        status: 'todo'
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error.response?.data?.error || 'Failed to fetch task';
    }
  },

  // Create a new task
  async createTask(projectId, sectionId, taskData) {
    try {
      // Uncomment when backend is ready
      // const response = await api.post(`/projects/${projectId}/sections/${sectionId}/tasks`, taskData);
      // return response.data.data;

      // Return mock data for now
      return Promise.resolve({
        id: `task-${Date.now()}`,
        ...taskData,
        status: 'todo'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw error.response?.data?.error || 'Failed to create task';
    }
  }
};
