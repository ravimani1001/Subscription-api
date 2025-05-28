const db = require('../config/db');

// CREATE subscription
const createSubscription = async (userId, planId, startDate, endDate) => {
  const result = await db.query(
    `INSERT INTO subscriptions (user_id, plan_id, status, start_date, end_date)
     VALUES ($1, $2, 'ACTIVE', $3, $4)
     RETURNING *`,
    [userId, planId, startDate, endDate]
  );
  return result.rows[0];
};

// GET subscription
const getSubscriptionByUserId = async (userId) => {
  const result = await db.query(
    `SELECT s.*, p.name AS plan_name, p.price, p.features
     FROM subscriptions s
     JOIN plans p ON s.plan_id = p.id
     WHERE s.user_id = $1 AND s.status = 'ACTIVE'`,
    [userId]
  );
  return result.rows[0];
};

// UPDATE subscription
const updateSubscription = async (userId, newPlanId, newEndDate) => {
  const result = await db.query(
    `UPDATE subscriptions
     SET plan_id = $1, end_date = $2
     WHERE user_id = $3 AND status = 'ACTIVE'
     RETURNING *`,
    [newPlanId, newEndDate, userId]
  );
  return result.rows[0];
};

// CANCEL subscription
const cancelSubscription = async (userId) => {
  const result = await db.query(
    `UPDATE subscriptions
     SET status = 'CANCELLED'
     WHERE user_id = $1 AND status = 'ACTIVE'
     RETURNING *`,
    [userId]
  );
  return result.rows[0];
};

// GET plan duration
const getPlanById = async (planId) => {
  const result = await db.query(`SELECT * FROM plans WHERE id = $1`, [planId]);
  return result.rows[0];
};

module.exports = {
  createSubscription,
  getSubscriptionByUserId,
  updateSubscription,
  cancelSubscription,
  getPlanById
};
