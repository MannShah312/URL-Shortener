const jwt = require("jsonwebtoken");

// Function to generate JWT token
const getToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET, // Add your JWT secret in the .env file
        { expiresIn: "2h" }     // Token expires in 2 hours
    );
};

module.exports = {
    getToken,
};