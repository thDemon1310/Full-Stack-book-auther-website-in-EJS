import mongoose from "mongoose";
import { type } from "os";
import path from "path";
const coverImageBasePath = "uploads/bookCovers";
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImage: {
    type: Buffer,
    required: true,
    // insted of passing a image into the data base
    // we will pass Name of the image to DB
    // and we will store image (file) to filesystem of the server
    // imp-> Always want to store files into filesystem when you can
  },
  coverImageType: {
    type: String,
    required: true,
  },
  auther: {
    // We want to reference auther form the autherModel collection
    type: mongoose.Schema.Types.ObjectId, // it is just telling mongoose that to reference to another object
    required: true,
    ref: "Auther",
  },
});

bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    const imgPath = path.join("/", coverImageBasePath, this.coverImageName);
    return imgPath;
  }
});

const bookData = mongoose.model("Book", bookSchema);

export default bookData;
export { coverImageBasePath };
