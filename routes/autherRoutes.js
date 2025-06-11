import express from "express";
const router = express.Router();
import Auther from "../models/autherModel.js";

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
    res.redirect("/authers");
    // res.redirect(`authers/${newAuther.id}`)
  } catch {
    res.render("authers/autherNew", {
      auther: auther,
      errorMessage: "Error creating Auther",
    });
  }
});

router.get("/:id", (req, res) => {
  res.send(`Show Auther ${req.params.id}`);
});

router.get("/:id/edit", (req, res) => {
  res.send(`Edit Auther ${req.params.id}`);
});

router.put("/:id", (req, res) => {
  res.send(`Update Auther ${req.params.id}`);
});

router.delete("/:id", (req, res) => {
  res.send(`Delete Auther ${req.params.id}`);
});
export default router;
