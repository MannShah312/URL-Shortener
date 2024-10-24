// // const express = require("express");
// // const router = express.Router();
// // const QRCode = require('qrcode');  // For generating QR code
// // const shortid = require("shortid");
// // const Url = require("../Models/Url");  // Assuming your model is named "Url"
// // const passport = require("passport");

// // const durationMapping = {
// //     "1hr": 1,
// //     "2hr": 2,
// //     "4hr": 4,
// //     "8hr": 8,
// //     "24hr": 24,
// //     "48hr": 48,
// //     "none": null, // No expiration
// // };

// //     // 1. Create a short URL with QR code generation and optional expiration
// //     router.post("/create", async (req, res) => {
// //         const { originalUrl, expirationDuration } = req.body;

// //         if (!originalUrl) {
// //             return res.status(400).json({ err: "Original URL is required." });
// //         }

// //         try {
// //             const shortUrlId = shortid.generate();  // Generate short ID
// //             const shortUrl = `${req.protocol}://${req.get('host')}/${shortUrlId}`;  // Create short URL
            
// //             // Generate QR code for the short URL
// //             const qrCode = await QRCode.toDataURL(shortUrl);

// //             // Calculate expiration date if duration is provided
// //             let expirationDate = null;
// //             if (expirationDuration && durationMapping[expirationDuration] !== undefined) {
// //                 const hours = durationMapping[expirationDuration];
// //                 if (hours) {
// //                     expirationDate = new Date(Date.now() + hours * 60 * 60 * 1000); // Calculate expiration date
// //                 }
// //             }

// //             const newUrl = await Url.create({
// //                 originalUrl,
// //                 shortUrl: shortUrlId,
// //                 qrCode,  // Storing the QR code image data as base64
// //                 expirationDate,  // Store the calculated expiration date
// //                 user: req.user ? req.user._id : null,  // Optional: If user authentication is enabled
// //             });

// //             return res.status(200).json({ shortUrl: shortUrlId, qrCode });
// //         } catch (error) {
// //             return res.status(500).json({ err: "Failed to create short URL." });
// //         }
// //     });

// // // 2. Redirect to the original URL and track clicks
// // router.get("/:shortUrlId", async (req, res) => {
// //     const { shortUrlId } = req.params;

// //     try {
// //         const urlRecord = await Url.findOne({ shortUrl: shortUrlId });
        
// //         if (!urlRecord) {
// //             return res.status(404).json({ err: "Short URL not found." });
// //         }

// //         // Increment click count
// //         urlRecord.clicks += 1;
// //         await urlRecord.save();

// //         // Redirect to the original URL
// //         return res.redirect(urlRecord.originalUrl);
// //     } catch (error) {
// //         return res.status(500).json({ err: "Error redirecting to the URL." });
// //     }
// // });

// // // Get all URLs created by the authenticated user
// // router.get("/myurls", passport.authenticate("jwt", { session: false }), async (req, res) => {
// //     try {
// //         const urls = await Url.find({ user: req.user._id }); // Fetch URLs for the logged-in user

// //         // Format the response to include required details
// //         const formattedUrls = urls.map(url => ({
// //             originalUrl: url.originalUrl,
// //             shortUrl: `${req.protocol}://${req.get('host')}/${url.shortUrl}`,
// //             qrCode: url.qrCode,
// //             clicks: url.clicks,
// //             expirationDate: url.expirationDate
// //         }));

// //         return res.status(200).json(formattedUrls);
// //     } catch (error) {
// //         return res.status(500).json({ err: "Error retrieving URLs." });
// //     }
// // });


// // router.get(
// //     "/click/:shortUrlId",
// //     passport.authenticate("jwt", { session: false }), // Add authentication here
// //     async (req, res) => {
// //         const { shortUrlId } = req.params;

// //         try {
// //             const urlData = await UrlModel.findOneAndUpdate(
// //                 { shortUrl: shortUrlId },
// //                 { $inc: { clicks: 1 } }, // Increment clicks
// //                 { new: true } // Return the updated document
// //             );

// //             if (!urlData) {
// //                 return res.status(404).json({ message: "Short URL not found." });
// //             }

// //             // Optional: Log the click for the authenticated user
// //             // You could log the click in a separate collection if you need to track user interactions
// //             // await ClickModel.create({ userId: req.user._id, shortUrlId: urlData._id });

// //             // Redirect to the original URL
// //             return res.redirect(urlData.originalUrl);
// //         } catch (error) {
// //             return res.status(500).json({ message: "Error tracking click." });
// //         }
// //     }
// // );
// // module.exports = router;

const express = require("express");
const router = express.Router();
const QRCode = require('qrcode');  // For generating QR code
const shortid = require("shortid");
const Url = require("../Models/Url");  // Assuming your model is named "Url"
const passport = require("passport");

const durationMapping = {
    "1hr": 1,
    "2hr": 2,
    "4hr": 4,
    "8hr": 8,
    "24hr": 24,
    "48hr": 48,
    "none": null, // No expiration
};

// 1. Create a short URL with QR code generation and optional expiration
router.post("/create", async (req, res) => {
    const { originalUrl, expirationDuration } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ err: "Original URL is required." });
    }

    try {
        const shortUrlId = shortid.generate();  // Generate short ID
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortUrlId}`;  // Create short URL
        
        // Generate QR code for the short URL
        const qrCode = await QRCode.toDataURL(shortUrl);

        // Calculate expiration date if duration is provided
        let expirationDate = null;
        if (expirationDuration && durationMapping[expirationDuration] !== undefined) {
            const hours = durationMapping[expirationDuration];
            if (hours) {
                expirationDate = new Date(Date.now() + hours * 60 * 60 * 1000); // Calculate expiration date
            }
        }

        const newUrl = await Url.create({
            originalUrl,
            shortUrl: shortUrlId,
            qrCode,  // Storing the QR code image data as base64
            expirationDate,  // Store the calculated expiration date
            user: req.user ? req.user._id : null,  // Optional: If user authentication is enabled
        });

        return res.status(200).json({ shortUrl: shortUrlId, qrCode });
    } catch (error) {
        return res.status(500).json({ err: "Failed to create short URL." });
    }
});

// 2. Redirect to the original URL and track clicks
router.get("/:shortUrlId", async (req, res) => {
    const { shortUrlId } = req.params;

    try {
        const urlRecord = await Url.findOne({ shortUrl: shortUrlId });
        
        if (!urlRecord) {
            return res.status(404).json({ err: "Short URL not found." });
        }

        // Increment click count
        urlRecord.clicks += 1;
        await urlRecord.save();

        // Redirect to the original URL
        return res.redirect(urlRecord.originalUrl);
    } catch (error) {
        return res.status(500).json({ err: "Error redirecting to the URL." });
    }
});

// Get all URLs created by the authenticated user
router.get("/myurls", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const urls = await Url.find({ user: req.user._id }); // Fetch URLs for the logged-in user

        // Format the response to include required details
        const formattedUrls = urls.map(url => ({
            originalUrl: url.originalUrl,
            shortUrl: `${req.protocol}://${req.get('host')}/${url.shortUrl}`,
            qrCode: url.qrCode,
            clicks: url.clicks,
            expirationDate: url.expirationDate
        }));

        return res.status(200).json(formattedUrls);
    } catch (error) {
        return res.status(500).json({ err: "Error retrieving URLs." });
    }
});

// Track clicks for a short URL
router.get("/click/:shortUrlId", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { shortUrlId } = req.params;

    try {
        const urlData = await Url.findOneAndUpdate(
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

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const QRCode = require('qrcode');  // For generating QR code
// const shortid = require("shortid");
// const Url = require("../Models/Url");  // Assuming your model is named "Url"
// const passport = require("passport");

// const durationMapping = {
//     "1hr": 1,
//     "2hr": 2,
//     "4hr": 4,
//     "8hr": 8,
//     "24hr": 24,
//     "48hr": 48,
//     "none": null, // No expiration
// };

// // 1. Create a short URL with QR code generation and optional expiration
// router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
//     const { originalUrl, expirationDuration } = req.body;

//     if (!originalUrl) {
//         return res.status(400).json({ err: "Original URL is required." });
//     }

//     try {
//         const shortUrlId = shortid.generate();  // Generate short ID
//         const shortUrl = `${req.protocol}://${req.get('host')}/${shortUrlId}`;  // Create short URL
        
//         // Generate QR code for the short URL
//         const qrCode = await QRCode.toDataURL(shortUrl);

//         // Calculate expiration date if duration is provided
//         let expirationDate = null;
//         if (expirationDuration && durationMapping[expirationDuration] !== undefined) {
//             const hours = durationMapping[expirationDuration];
//             if (hours) {
//                 expirationDate = new Date(Date.now() + hours * 60 * 60 * 1000); // Calculate expiration date
//             }
//         }

//         const newUrl = await Url.create({
//             originalUrl,
//             shortUrl: shortUrlId,
//             qrCode,  // Storing the QR code image data as base64
//             expirationDate,  // Store the calculated expiration date
//             user: req.user ? req.user._id : null,  // Optional: If user authentication is enabled
//         });

//         return res.status(200).json({ shortUrl: shortUrlId, qrCode });
//     } catch (error) {
//         return res.status(500).json({ err: "Failed to create short URL." });
//     }
// });

// // 2. Redirect to the original URL and track clicks
// router.get("/:shortUrlId", async (req, res) => {
//     const { shortUrlId } = req.params;

//     try {
//         const urlRecord = await Url.findOne({ shortUrl: shortUrlId });
        
//         if (!urlRecord) {
//             return res.status(404).json({ err: "Short URL not found." });
//         }

//         // Increment click count
//         urlRecord.clicks += 1;
//         await urlRecord.save();

//         // Redirect to the original URL
//         return res.redirect(urlRecord.originalUrl);
//     } catch (error) {
//         return res.status(500).json({ err: "Error redirecting to the URL." });
//     }
// });

// // Get all URLs created by the authenticated user
// router.get("/myurls", passport.authenticate("jwt", { session: false }), async (req, res) => {
//     try {
//         const urls = await Url.find({ user: req.user._id }); // Fetch URLs for the logged-in user

//         // Format the response to include required details
//         const formattedUrls = urls.map(url => ({
//             originalUrl: url.originalUrl,
//             shortUrl: `${req.protocol}://${req.get('host')}/${url.shortUrl}`,
//             qrCode: url.qrCode,
//             clicks: url.clicks,
//             expirationDate: url.expirationDate
//         }));

//         return res.status(200).json(formattedUrls);
//     } catch (error) {
//         return res.status(500).json({ err: "Error retrieving URLs." });
//     }
// });


// router.get('/myurls', authenticate, async (req, res) => {
//     try {
//         const userId = req.user.id; // Assuming you set user ID in req.user after authentication
//         const urls = await UrlModel.find({ userId });
//         res.json(urls);
//     } catch (error) {
//         console.error("Error fetching URLs:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// // Track clicks for a short URL
// router.get("/click/:shortUrlId", async (req, res) => {
//     const { shortUrlId } = req.params;

//     try {
//         const urlData = await Url.findOneAndUpdate(
//             { shortUrl: shortUrlId },
//             { $inc: { clicks: 1 } }, // Increment clicks
//             { new: true } // Return the updated document
//         );

//         if (!urlData) {
//             return res.status(404).json({ message: "Short URL not found." });
//         }

//         // Redirect to the original URL
//         return res.redirect(urlData.originalUrl);
//     } catch (error) {
//         return res.status(500).json({ message: "Error tracking click." });
//     }
// });

// // Get all URLs for unauthenticated users (optional)
// router.get("/myurls", async (req, res) => {
//     try {
//         const urls = await Url.find({ user: null }); // Fetch public URLs

//         // Format the response to include required details
//         const formattedUrls = urls.map(url => ({
//             originalUrl: url.originalUrl,
//             shortUrl: `${req.protocol}://${req.get('host')}/${url.shortUrl}`,
//             qrCode: url.qrCode,
//             clicks: url.clicks,
//             expirationDate: url.expirationDate
//         }));

//         return res.status(200).json(formattedUrls);
//     } catch (error) {
//         return res.status(500).json({ err: "Error retrieving public URLs." });
//     }
// });

// module.exports = router;