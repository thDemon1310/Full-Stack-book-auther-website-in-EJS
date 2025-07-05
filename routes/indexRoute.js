import express from "express";
import Book from "../models/bookModel.js";
const router = express.Router();

router.get("/", async (req, res) => {
  let dbBookList;
  try {
    dbBookList = await Book.find({})
      .sort({ createdAt: "descending" })
      .limit(10)
      .exec();
  } catch (error) {
    console.error(error);
    dbBookList = [];
  }
  res.render("index", {
    booksList: dbBookList,
  });
});

export default router;
