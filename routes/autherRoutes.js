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
router.post("/", (req, res) => {
  res.send("Create");
  console.log(`Creating auther name and saving it to database`);
});

export default router;
