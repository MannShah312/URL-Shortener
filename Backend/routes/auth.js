const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");

// POST route for user registration
router.post("/register", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).json({ error: "A user with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        const token = await getToken(email, newUser);
        const userToReturn = { ...newUser.toJSON(), token };
        delete userToReturn.password;
        return res.status(201).json(userToReturn);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// POST route for user login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ error: "Invalid credentials" });
        }

        const token = await getToken(user.email, user);
        const userToReturn = { ...user.toJSON(), token };
        delete userToReturn.password;
        return res.status(200).json(userToReturn);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;