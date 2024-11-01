// Import Express and create a router instance
const express = require("express");
const router = express.Router();

// Import the Product model
const Product = require("../db/product");

// ============================================================================
// Create a new product
// ============================================================================
// Endpoint: POST /api/products
router.post("/add", async (req, res) => {
    try {
        const { name, shortDescription, description, purchasePrice, sellingPrice, rating, images, categoryId } = req.body;
        console.log("Creating new product:", name);

        const product = new Product({
            name,
            shortDescription,
            description,
            purchasePrice,
            sellingPrice,
            rating,
            images,
            categoryId
        });
        await product.save();

        res.status(201).send(product.toObject());
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send({ message: "Failed to create product" });
    }
});

// ============================================================================
// Read all products
// ============================================================================
// Endpoint: GET /api/products
router.get("/", async (req, res) => {
    try {
        console.log("Fetching all products");

        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ message: "Failed to fetch products" });
    }
});

// ============================================================================
// Read a single product by ID
// ============================================================================
// Endpoint: GET /api/products/:id
router.get("/:id", async (req, res) => {
    try {
        const id = req.params['id'];
        console.log(`Fetching product with ID: ${id}`);

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send({ message: "Failed to fetch product" });
    }
});

// ============================================================================
// Update an existing product by ID
// ============================================================================
// Endpoint: PUT /api/products/:id
router.put("/:id", async (req, res) => {
    try {
        const { name, shortDescription, description, purchasePrice, sellingPrice, rating, images, categoryId } = req.body;
        const id = req.params['id'];

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            { name, shortDescription, description, purchasePrice, sellingPrice, rating, images, categoryId },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send({ message: "Failed to update product" });
    }
});

// ============================================================================
// Delete an existing product by ID
// ============================================================================
// Endpoint: DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params['id'];
        console.log(`Deleting product with ID: ${id}`);

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send({ message: "Failed to delete product" });
    }
});

// Export the router for use in the main application
module.exports = router;
