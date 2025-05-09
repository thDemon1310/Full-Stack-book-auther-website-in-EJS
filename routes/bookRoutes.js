import express from "express";
import Book from "../models/bookModel.js";
const router = express.Router();

// All book routes
router.get("/", async (req, res) => {
    res.send('Book index page')
});

// New Book routes
router.get("/new", (req, res) => {
    res.send('New Book')
});

// Create Book Routes
router.post("/", async (req, res) => {
    res.send('Create Book')
    console.log('post request from client for books')
});

export default router;
