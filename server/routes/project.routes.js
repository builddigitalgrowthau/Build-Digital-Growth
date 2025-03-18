const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/project.controller');

const taskRouter = require('./task.routes');

// Re-route to task router
router.use('/:projectId/tasks', taskRouter);

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getAllProjects)
  .post(createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
