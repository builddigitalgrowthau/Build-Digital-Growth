import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import Sidebar from '../dashboard/Sidebar';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';

const ProjectManagement = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [openTaskId, setOpenTaskId] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        // Fetch project details
        const projectData = await projectService.getProject(projectId);
        setProject(projectData);

        // Fetch tasks and activities (mock data for now)
        const tasksData = [
          { id: 'task-1', title: 'Add Staging Site to WP Engine', status: 'todo' },
          { id: 'task-2', title: 'Add Hello Elementor Theme', status: 'todo' },
          { id: 'task-3', title: 'Add Core Plugins', status: 'todo' },
          { id: 'task-4', title: 'Develop Homepage/Header/Footer', status: 'todo' },
          { id: 'task-5', title: 'Develop Inner Pages + Any Templates', status: 'todo' }
        ];

        setTasks(tasksData);

        const activitiesData = [
          { id: 'activity-1', user: 'Daniel K.', action: 'created project', date: '2023-07-15' },
          { id: 'activity-2', user: 'Daniel K.', action: 'added task "Add Staging Site to WP Engine"', date: '2023-07-15' }
        ];

        setActivities(activitiesData);

      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const toggleTaskDetails = (taskId) => {
    setOpenTaskId(openTaskId === taskId ? null : taskId);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg">
            <div className="text-red-500 text-lg mb-2">Error</div>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        {/* Project Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">{project?.name || 'Project'}</h1>
          <p className="text-gray-600 mt-1">{project?.description}</p>
        </div>

        {/* Project Content */}
        <div className="flex flex-col md:flex-row">
          {/* Tasks */}
          <div className="w-full md:w-2/3 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-800">Tasks</h2>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Task
              </button>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleTaskDetails(task.id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <input
                          type="checkbox"
                          checked={task.status === 'complete'}
                          onChange={(e) => e.stopPropagation()}
                          className="h-5 w-5 text-yellow-500 rounded focus:ring-yellow-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-800">{task.title}</h3>
                      </div>
                      <div className="ml-3">
                        <Clock size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="w-full md:w-1/3 p-8 border-t md:border-t-0 md:border-l border-gray-200">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Activity</h2>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="bg-yellow-100 text-yellow-800 h-8 w-8 rounded-full flex items-center justify-center font-medium mr-3">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {openTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">
                {tasks.find(t => t.id === openTaskId)?.title}
              </h2>
              <button
                onClick={() => setOpenTaskId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-gray-600">Task details would appear here.</p>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setOpenTaskId(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
