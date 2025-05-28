const { createPlan, getAllPlans } = require('../models/planModel');

const create = async (req, res) => {
  const { name, price, features, duration } = req.body;
  try {
    if (!name || !price || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const plan = await createPlan(name, price, features || [], duration);
    res.status(201).json({ message: 'Plan created', plan });
  } catch (err) {
    console.error('Error creating plan:', err);
    res.status(500).json({ error: 'Failed to create plan' });
  }
};

const getAll = async (req, res) => {
  try {
    const plans = await getAllPlans();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get plans' });
  }
};

module.exports = { create, getAll };
