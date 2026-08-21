const Project = require('../models/Project');

async function getProjects(req, res) {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createProject(req, res) {
  try {
    const { title, description, image, techStack, link, order } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const project = await Project.create({
      title,
      description,
      image,
      techStack,
      link,
      order: Number(order) || 0
    });
    res.status(201).json({ success: true, message: 'Project created successfully', project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { title, description, image, techStack, link, order } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const project = await Project.findByIdAndUpdate(
      id,
      { title, description, image, techStack, link, order: Number(order) || 0 },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project updated successfully', project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
