const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");

// Image upload configuration
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

// Inserting a user into the database route
router.post("/add", upload, async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });

    try {
        await user.save();  // Save user with async/await
        req.session.message = {
            type: "success",
            message: "User added successfully!"
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Get Users route
// Get Users route
router.get("/", async (req, res) => {
    try {
        const users = await User.find();  // Fetch users from the database
        res.render("index", {
            title: 'Home Page',
            users: users,  // Pass the users to the template
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });  // Handle errors
    }
});


// Home route
router.get("/", (req, res) => {
    res.render("index.ejs", { title: "Home Page" });
});

// Route for adding users
router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

module.exports = router;
