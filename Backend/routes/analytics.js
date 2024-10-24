const express = require("express");
const router = express.Router();
const UrlModel = require("../Models/Url"); // Adjust the path as needed

// Track clicks on the shortened URL
router.get("/click/:shortUrlId", async (req, res) => {
    const { shortUrlId } = req.params;

    try {
        const urlData = await UrlModel.findOneAndUpdate(
            { shortUrl: shortUrlId },
            { $inc: { clicks: 1 } }, // Increment clicks
            { new: true } // Return the updated document
        );

        if (!urlData) {
            return res.status(404).json({ message: "Short URL not found." });
        }

        // Redirect to the original URL
        return res.redirect(urlData.originalUrl);
    } catch (error) {
        return res.status(500).json({ message: "Error tracking click." });
    }
});

// Get analytics data for the shortened URL
router.get("/info/:shortUrlId", async (req, res) => {
    const { shortUrlId } = req.params;

    try {
        const urlData = await UrlModel.findOne({ shortUrl: shortUrlId });

        if (!urlData) {
            return res.status(404).json({ message: "Short URL not found." });
        }

        // Prepare analytics data
        const analytics = {
            originalUrl: urlData.originalUrl,
            shortUrl: urlData.shortUrl,
            clicks: urlData.clicks,
            createdAt: urlData.createdAt,
            expirationDate: urlData.expirationDate,
        };

        return res.status(200).json(analytics);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving analytics." });
    }
});
module.exports = router;