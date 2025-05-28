// import { createClient } from 'redis';
// import dotenv from 'dotenv';
const { createClient } = require('redis');

require("dotenv").config();

const redisOptions = {
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD || undefined,
};

// console.log("REDIS URL" , process.env.REDIS_URL)
const publisher = createClient({url : process.env.REDIS_URL});
const subscriber = createClient({url : process.env.REDIS_URL});

publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

(async () => {
  await publisher.connect();
  await subscriber.connect();
})();

module.exports =  { publisher, subscriber };
