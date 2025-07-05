import express from "express";
import path from "path";
import Book from "../models/bookModel.js";
import Auther from "../models/autherModel.js";
import { fileURLToPath } from "url";
import { url } from "inspector";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/jpg",
  "image/webp",
];

// All book routes
router.get("/", async (req, res) => {
  let searchQuery = Book.find();
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
  await saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    res.redirect(`books/${newBook.id}`);
    console.log(`Book info saved to DB`);
  } catch (error) {
    console.error(error);
    await renderNewPage(res, book);
  }
});

//Show Book by id route
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("auther").exec();
    res.render("books/bookShow.ejs", {
      bookData: book,
    });
  } catch (error) {
    res.redirect("/");
  }
});

// Edit the book by id route
router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch (err) {
    res.redirect("/");
  }
});

// PUT methout for edit route
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    {
      book.title = req.body.title;
      book.auther = req.body.author;
      book.publishDate = new Date(req.body.publishDate);
      book.pageCount = req.body.pageCount;
      book.description = req.body.description;
    }
    if (req.body.cover != null && req.body.cover !== "") {
      await saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (err) {
    if (book != null) {
      renderEditPage(res, book);
    } else {
      res.redirect("/");
    }
  }
});

// DELETE Route for deleting the book by ID
router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.deleteOne();
    res.redirect("/books");
  } catch (error) {
    if (book != null) {
      res.render("books/bookShow", {
        book: book,
        errorMessage: `Could not delete the book`,
      });
    } else {
      res.redirect("/");
    }
  }
});

// =======Functions========

const renderNewPage = async (res, book) => {
  renderFormPage(res, book, "New");
};

const renderEditPage = async (res, book) => {
  renderFormPage(res, book, "Edit");
};

const renderFormPage = async (res, book, formType) => {
  try {
    const authers = await Auther.find({});
    const params = {
      authersList: authers,
      book: book,
    };
    res.render(`books/book${formType}`, params);
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
    book.coverImageType = cover.type;
  }
};

export default router;
