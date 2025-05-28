const db = require("./config/db");

//THIS IS A UTILITY FILE TO RUN TABLE CREATION QUERIES ON DATABASE
const run = async () => {
  try {
    const result = await db.query(
      `CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    );

    const result1 = await db.query(
      `CREATE TABLE plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        features JSONB,
        duration INTEGER NOT NULL
        )`
    );
    
    const result2 = await db.query(
      `CREATE TABLE subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        plan_id UUID REFERENCES plans(id),
        status TEXT CHECK (status IN ('ACTIVE', 'CANCELLED', 'EXPIRED')),
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP
        )`
    );
    
    console.log("TABLE CREATED!");
  } catch (err) {
    console.log(err, err.message);
  }
};


// run();
