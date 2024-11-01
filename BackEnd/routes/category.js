// Import Express and create a router instance
const express = require("express");
const router = express.Router();

// Import the Category model
const Category = require("../db/category");

// ============================================================================
// Create a new category
// ============================================================================
// Endpoint: POST /api/categories
router.post("/add", async (req, res) => {
    try {
        // Get data from the request body
        let model = req.body;

        // Log the incoming data for debugging
        console.log("Creating category:", model.name);

        // Create a new Category instance and save it to the database
        let category = new Category({
            name: model.name
        });
        await category.save();

        // Send the newly created category back as a response
        res.status(201).send(category.toObject());
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send({ message: "Failed to create category" });
    }
});

// ============================================================================
// Read all categories
// ============================================================================
// Endpoint: GET /api/categories
router.get("/", async (req, res) => {
    try {
        console.log("Fetching all categories");

        // Fetch all categories from the database
        const categories = await Category.find({});
        res.status(200).send(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send({ message: "Failed to fetch categories" });
    }
});

// ============================================================================
// Read a single category by ID
// ============================================================================
// Endpoint: GET /api/categories/:id
router.get("/:id", async (req, res) => {
    try {
        // Get the category ID from the URL
        let id = req.params['id'];
        console.log(`Fetching category with ID: ${id}`);

        // Fetch the category from the database
        const category = await Category.findById(id);

        // If category is not found, return a 404 error
        if (!category) {
            return res.status(404).send({ message: "Category not found" });
        }

        res.status(200).send(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).send({ message: "Failed to fetch category" });
    }
});

// ============================================================================
// Update an existing category by ID
// ============================================================================
// Endpoint: PUT /api/categories/:id
router.put("/:id", async (req, res) => {
    try {
        console.log("Updating category");

        // Get data from the request body and category ID from URL
        let model = req.body;
        let id = req.params['id'];

        // Update the category in the database
        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id },
            { name: model.name },
            { new: true, runValidators: true } // Options: return the updated document and validate
        );

        // If category is not found, return a 404 error
        if (!updatedCategory) {
            return res.status(404).send({ message: "Category not found" });
        }

        // Send the updated category as a response
        res.status(200).send(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send({ message: "Failed to update category" });
    }
});

// ============================================================================
// Delete an existing category by ID
// ============================================================================
// Endpoint: DELETE /api/categories/:id
router.delete("/delete/:id", async (req, res) => {
    try {
        // Get the category ID from the URL
        let id = req.params['id'];
        console.log(`Deleting category with ID: ${id}`);

        // Delete the category from the database
        const deletedCategory = await Category.findByIdAndDelete(id);

        // If category is not found, return a 404 error
        if (!deletedCategory) {
            return res.status(404).send({ message: "Category not found" });
        }

        // Send confirmation message as a response
        res.status(200).send({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send({ message: "Failed to delete category" });
    }
});

// Export the router for use in the main application
module.exports = router;
