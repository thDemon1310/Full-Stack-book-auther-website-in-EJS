import express from "express";
const router = express.Router();
import Auther from "../models/autherModel.js";

// All auther routes
router.get("/", (req, res) => {
  res.render("authers/autherIndex");
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
    const newAuther =await auther.save();
    console.log(`The name save to database`);
    res.redirect("authers");
    // res.redirect(`authers/${newAuther.id}`)
  } catch {
    res.render("authers/autherNew", {
      auther: auther,
      errorMessage: "Error creating Auther",
    });
  }
});

export default router;
