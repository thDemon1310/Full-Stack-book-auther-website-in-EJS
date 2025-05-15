import express from "express";
import multer from "multer";
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
const uplode = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});
// All book routes
router.get("/", async (req, res) => {
  try {
    const dbBookList = await Book.find({})
    res.render("books/bookIndex", {
      booksList: dbBookList,
      searchOptions: req.query,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/")
  }
});

// New Book routes
router.get("/new", async (req, res) => {
  await renderNewPage(res, new Book());
});

// Create Book Routes
router.post("/", uplode.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    auther: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
    coverImageName: fileName,
    // We are not putting the cover image name inside of the book object because first we need to create the cover image file on our filesystem get the name form that and then save that into our book object
    // libreary for this is multer
    // Multer allow ous to use multi-part forms
    // we have to use multipart/form-data when our form includes <input type="file"> element
  });
  try {
    const newBook = await book.save();
    // res.redirect(`books\\${newBook.id}`)
    res.redirect("books");
  } catch (error) {
    console.error(error);
    if (book.coverImageName != null) {
      await removeBookCover(book.coverImageName);
    }
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

const removeBookCover = async (ImageName) => {
  const errorImagePath = path.join(uploadPath, ImageName);
  try {
    await fs.rm(errorImagePath);
  } catch (error) {
    console.error(error);
  }
};

export default router;
