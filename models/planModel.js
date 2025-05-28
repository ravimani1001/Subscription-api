const db = require('../config/db');

const createPlan = async (name, price, features, duration) => {
  const result = await db.query(
    `INSERT INTO plans (name, price, features, duration)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, price, JSON.stringify(features), duration]
  );
  return result.rows[0];
};

const getAllPlans = async () => {
  const result = await db.query('SELECT * FROM plans ORDER BY price ASC');
  return result.rows;
};

module.exports = {
  createPlan,
  getAllPlans
};
