const cron = require('node-cron');
const db = require('../config/db');

// Run every minute 
cron.schedule('* * * * *', async () => {
  try {
    const result = await db.query(`
      UPDATE subscriptions
      SET status = 'EXPIRED'
      WHERE status = 'ACTIVE' AND end_date < NOW()
    `);
    console.log(`Cron Job: Expired ${result.rowCount} subscriptions`);
  } catch (err) {
    console.error('Cron Job Failed:', err.message);
  }
});
