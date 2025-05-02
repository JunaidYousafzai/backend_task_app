const jwt = require('jsonwebtoken');
require("dotenv").config(); 

const authenticateUser = (request, response, next) => {
  const authHeader = request.header('Authorization');
  console.log(" Auth Header:", authHeader);

  const token = authHeader?.replace('Bearer ', '').trim();
  console.log(" Extracted Token:", token);

  if (!token) {
    return response.status(401).json({ message: "Access denied. No token provided." });
  }

  console.log(" JWT_SECRET from .env:", process.env.JWT_TOKEN); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    console.log(" Token decoded successfully:", decoded);

    request.user = decoded;
    next();
  } catch (error) {
    console.error(" Token verification error:", error.message);

    return response.status(400).json({ 
      message: "Invalid token.",
      error: error.message,
    });
  }
};

module.exports = authenticateUser;
