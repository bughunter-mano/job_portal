const Client = require('../models/Client');

async function getClients(req, res) {
  try {
    const clients = await Client.find().sort({ order: 1 });
    res.json({ success: true, clients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createClient(req, res) {
  try {
    const { name, logo, about, order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const client = await Client.create({ name, logo, about, order: Number(order) || 0 });
    res.status(201).json({ success: true, message: 'Client created successfully', client });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateClient(req, res) {
  try {
    const { id } = req.params;
    const { name, logo, about, order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const client = await Client.findByIdAndUpdate(
      id,
      { name, logo, about, order: Number(order) || 0 },
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, message: 'Client updated successfully', client });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteClient(req, res) {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient
};
