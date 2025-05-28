// import { subscriber } from './redisClient.js';
const { subscriber } = require("./redisClient");
const db = require("../config/db");
const { sendWelcomeEmail } = require("../utils/sendMail");

const listenToSubscriptionEvents = async () => {
  await subscriber.subscribe("subscription_created", async (message) => {
    const event = JSON.parse(message);

    const result = await db.query(`SELECT * FROM users WHERE id = $1`, [
      event.userId,
    ]);
    // console.log(result.rows[0].email)
    await sendWelcomeEmail(result.rows[0].email, event);
    console.log(event);
  });

  await subscriber.subscribe("upgraded_subscription", async (message) => {
    const event = JSON.parse(message);

    const result = await db.query(`SELECT * FROM users WHERE id = $1`, [
      event.userId,
    ]);
    // console.log(result.rows[0].email)
    await sendWelcomeEmail(result.rows[0].email, event);
    console.log(event);
  });

  await subscriber.subscribe("cancelled_subscription", async (message) => {
    const event = JSON.parse(message);

    const result = await db.query(`SELECT * FROM users WHERE id = $1`, [
      event.userId,
    ]);
    // console.log(result.rows[0].email)
    await sendWelcomeEmail(result.rows[0].email, event);
    console.log(event);
  });
};

listenToSubscriptionEvents();
