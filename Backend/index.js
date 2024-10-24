const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./Models/User");
const urlRoutes = require("./routes/url");
const authRoutes = require("./routes/auth");
const analyticRoutes = require("./routes/analytics");
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require("cors");
const port = 4000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Database
mongoose
    .connect(
        // "mongodb+srv://MannShah:" +
        // process.env.MONGO_PASSWORD +    
        // "@cluster0.w7gzuhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        "mongodb+srv://User32:" + 
         process.env.MONGO_PASSWORD +
        "@cluster0.bhrf9zn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        // {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // }
    )
    .then((x) => {
        console.log("Connected to Mongo!");
    })
    .catch((err) => {
        console.log("Error while connecting to Mongo");
    });
// Passport Authentication

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET // Store your secret in environment variables
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id); // Ensure this matches your JWT creation
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    app.use("/auth", authRoutes);
    app.use("/url", urlRoutes);
    app.use("/analytics", analyticRoutes);

app.listen(port, () => {
    console.log("App is running on port " + port);
});