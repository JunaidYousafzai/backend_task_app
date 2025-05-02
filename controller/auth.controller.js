
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const signup = async (req, res) => {
  const { username, email, contact,password } = req.body;

  if (!username || !email || !contact  || !password) {
    return res.status(400).json({ message: "Every field must be filled!" });
  }

  try {
    const [existingUser] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (username, email, contact,password) VALUES (?, ?, ?, ?)`,
      [username, email, contact,  hashedPassword]
    );

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};



 

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const [users] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" }
    );


    res.status(200).json({
      message: "Login successful",
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};




module.exports = {
    signup,
    login
}