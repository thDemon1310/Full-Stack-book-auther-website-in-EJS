import express from "express";
const router = express.Router();
import Auther from "../models/autherModel.js";
import Book from "../models/bookModel.js";

// All auther routes
router.get("/", async (req, res) => {
  let searchOptions = {};
  let getQuery = req.query.autherName;
  if (getQuery != null && getQuery !== "") {
    searchOptions.name = new RegExp(getQuery, "i");
  }
  try {
    const dbAutherList = await Auther.find(searchOptions);
    res.render("authers/autherIndex", {
      authersList: dbAutherList,
      searchOptions: req.query,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// New Auther Routes
router.get("/new", (req, res) => {
  res.render("authers/autherNew", { auther: new Auther() });
});

// Creating new auther routes
router.post("/", async (req, res) => {
  const auther = new Auther({
    name: req.body.name,
  });
  try {
    const newAuther = await auther.save();
    console.log(`The name save to database`);
    res.redirect(`authers/${newAuther.id}`);
  } catch {
    res.render("authers/autherNew", {
      auther: auther,
      errorMessage: "Error creating Auther",
    });
  }
});
0;

router.get("/:id", async (req, res) => {
  try {
    const auther = await Auther.findById(req.params.id);
    const books = await Book.find({ auther: auther.id }).limit(6).exec();
    res.render("authers/autherShow", {
      autherData: auther,
      booksByAuther: books,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/authers");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const auther = await Auther.findById(req.params.id);
    res.render("authers/autherEdit", { auther: auther });
  } catch (error) {
    res.redirect("/authers");
  }
});

router.put("/:id", async (req, res) => {
  let auther;
  try {
    auther = await Auther.findById(req.params.id);
    auther.name = req.body.name;
    await auther.save();
    console.log(`The name updated to database`);
    res.redirect(`/authers/${auther.id}`);
  } catch {
    if (auther == null) {
      res.redirect("/");
    } else {
      res.render("authers/autherEdit", {
        auther: auther,
        errorMessage: "Error Updating Auther",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let auther;
  try {
    auther = await Auther.findById(req.params.id);
    await auther.deleteOne();
    console.log(`The name deleted to database`);
    res.redirect(`/authers`);
  } catch (error) {
    if (auther == null) {
      res.redirect("/");
    } else {
      console.log(error);
      res.redirect(`/authers/${auther.id}`);
    }
  }
});
export default router;
