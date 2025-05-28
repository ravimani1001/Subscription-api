const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {

    //Validation
    if(!name || !email || !password){
        return res.status(400).json({ error: "Name, Email and Password fields are required" });
    }

    // 1. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await createUser(name, email, hashedPassword);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {

    //Validation
    if(!email || !password){
        return res.status(400).json({ error: "Email and Password fields are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' });

    //  Set cookie 
    res.cookie('token', token, {
      httpOnly: true,       // not accessible via JS
      secure: false,        // set to true in production (HTTPS)
      sameSite: 'lax',      // helps prevent CSRF
      maxAge: 2 * 60 * 60 * 1000 // 2 hours in ms
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };


