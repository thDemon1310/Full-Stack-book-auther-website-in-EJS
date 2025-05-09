import express from "express";
import Book from "../models/bookModel.js";
import Auther from "../models/autherModel.js";
const router = express.Router();

// All book routes
router.get("/", async (req, res) => {
  res.render("books/bookIndex");
});

// New Book routes
router.get("/new", async (req, res) => {
  try {
    const authers = await  Auther.find({});
    const book = new Book();
    res.render("books/bookNew", {
      authersList: authers,
      book: book,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/books/")
    
  }
});

// Create Book Routes
router.post("/", async (req, res) => {
  res.send("Create Book");
  console.log("post request from client for books");
});

export default router;
