const Project = require('../models/project.model');
const Task = require('../models/task.model');

// Get all projects for current user
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id });

    // Calculate completion percentage for each project
    const projectsWithCompletion = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });
        const completedTasks = tasks.filter(task => task.status === 'complete').length;
        const totalTasks = tasks.length;
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...project.toObject(),
          completionPercentage
        };
      })
    );

    res.status(200).json({
      success: true,
      data: projectsWithCompletion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if user owns the project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to access this project'
      });
    }

    // Calculate completion percentage
    const tasks = await Task.find({ project: project._id });
    const completedTasks = tasks.filter(task => task.status === 'complete').length;
    const totalTasks = tasks.length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const projectData = {
      ...project.toObject(),
      completionPercentage
    };

    res.status(200).json({
      success: true,
      data: projectData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    // Add the current user as owner
    req.body.owner = req.user._id;

    // Format client data if provided
    if (req.body.clientName || req.body.clientEmail) {
      req.body.client = {
        name: req.body.clientName,
        email: req.body.clientEmail
      };

      // Remove separate fields
      delete req.body.clientName;
      delete req.body.clientEmail;
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if user owns the project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to update this project'
      });
    }

    // Format client data if provided
    if (req.body.clientName || req.body.clientEmail) {
      req.body.client = {
        name: req.body.clientName || project.client?.name,
        email: req.body.clientEmail || project.client?.email
      };

      // Remove separate fields
      delete req.body.clientName;
      delete req.body.clientEmail;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if user owns the project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this project'
      });
    }

    // Delete associated tasks
    await Task.deleteMany({ project: req.params.id });

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
