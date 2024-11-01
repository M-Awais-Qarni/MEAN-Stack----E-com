// Import Express and create a router instance
const express = require("express");
const router = express.Router();

// Import the User model
const User = require("../db/users");

// ============================================================================
// Create a new user
// ============================================================================
// Endpoint: POST /api/users
router.post("/add", async (req, res) => {
    try {
        // Get data from the request body
        const { name, email, password, isAdmin } = req.body;

        // Log the incoming data for debugging
        console.log("Creating new user:", email);

        // Create a new User instance and save it to the database
        const user = new User({
            name,
            email,
            password,
            isAdmin: isAdmin || false, // Default to false if not provided
        });
        await user.save();

        // Send the newly created user back as a response (excluding password)
        res.status(201).send({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: "Failed to create user" });
    }
});

// ============================================================================
// Read all users
// ============================================================================
// Endpoint: GET /api/users
router.get("/", async (req, res) => {
    try {
        console.log("Fetching all users");

        // Fetch all users from the database (excluding passwords for security)
        const users = await User.find({}, { password: 0 });
        res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Failed to fetch users" });
    }
});

// ============================================================================
// Read a single user by ID
// ============================================================================
// Endpoint: GET /api/users/:id
router.get("/:id", async (req, res) => {
    try {
        // Get the user ID from the URL
        const id = req.params['id'];
        console.log(`Fetching user with ID: ${id}`);

        // Fetch the user from the database (excluding password)
        const user = await User.findById(id, { password: 0 });

        // If user is not found, return a 404 error
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ message: "Failed to fetch user" });
    }
});

// ============================================================================
// Update an existing user by ID
// ============================================================================
// Endpoint: PUT /api/users/:id
router.put("/:id", async (req, res) => {
    try {
        console.log("Updating user");

        // Get data from the request body and user ID from URL
        const { name, email, password, isAdmin } = req.body;
        const id = req.params['id'];

        // Update the user in the database
        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { name, email, password, isAdmin },
            { new: true, runValidators: true, fields: { password: 0 } } // Exclude password in the response
        );

        // If user is not found, return a 404 error
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Failed to update user" });
    }
});

// ============================================================================
// Delete an existing user by ID
// ============================================================================
// Endpoint: DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
    try {
        // Get the user ID from the URL
        const id = req.params['id'];
        console.log(`Deleting user with ID: ${id}`);

        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(id);

        // If user is not found, return a 404 error
        if (!deletedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: "Failed to delete user" });
    }
});

// Export the router for use in the main application
module.exports = router;
