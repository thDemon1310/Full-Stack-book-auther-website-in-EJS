import express from "express";
const router = express.Router();
import Auther from "../models/autherModel.js";

// All auther routes
router.get("/", async (req, res) => {
  let searchOptions = {};
  let getQuery = req.query.autherName;
  // console.log(getQuery)
  if (getQuery != null && getQuery !== "") {
    searchOptions.name = new RegExp(getQuery, "i");
  }
  // console.log(searchOptions);

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
    res.redirect("/authers");
    // res.redirect(`authers/${newAuther.id}`)
  } catch {
    res.render("authers/autherNew", {
      auther: auther,
      errorMessage: "Error creating Auther",
    });
  }
});

export default router;
