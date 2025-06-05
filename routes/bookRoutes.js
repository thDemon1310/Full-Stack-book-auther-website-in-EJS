import express from "express";
import path from "path";
import fs from "fs/promises";
import Book, { coverImageBasePath } from "../models/bookModel.js";
import Auther from "../models/autherModel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../public", coverImageBasePath);
const router = express.Router();

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
// const uplode = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

// All book routes
router.get("/", async (req, res) => {
  let searchQuery = Book.find(); // If we dont execute any method this will return  a object which can you to develop a query we will build it by using request query
  if (req.query.bookTitle != null && req.query.bookTitle != "") {
    searchQuery = searchQuery.regex(
      "title",
      new RegExp(req.query.bookTitle, "i")
    );
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    searchQuery = searchQuery.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    searchQuery = searchQuery.gte("publishDate", req.query.publishedAfter);
  }

  try {
    const dbBookList = await searchQuery.exec(); //Book.find({});
    res.render("books/bookIndex", {
      booksList: dbBookList,
      searchOptions: req.query,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// New Book routes
router.get("/new", async (req, res) => {
  await renderNewPage(res, new Book());
});

// Create Book Routes
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    auther: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });
  saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    // res.redirect(`books\\${newBook.id}`)
    res.redirect("books");
  } catch (error) {
    console.error(error);
    await renderNewPage(res, book);
  }
});

const renderNewPage = async (res, book) => {
  try {
    const authers = await Auther.find({});
    const params = {
      authersList: authers,
      book: book,
    };
    res.render("books/bookNew", params);
  } catch (error) {
    console.error(error);
    res.redirect("/books");
  }
};

const saveCover = async (book, encodedCover) => {
  if (encodedCover == null) {
    return;
  }
  const cover = await JSON.parse(encodedCover);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType= cover.type
  }
};
export default router;
