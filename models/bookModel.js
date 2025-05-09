import mongoose from "mongoose";

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
  coverImageName: {
    type: String,
    required: true,
    // insted of passing a image into the data base
    // we will pass Name of the image to DB
    // and we will store image (file) to filesystem of the server
    // imp-> Always want to store files into filesystem when you can
  },
  auther: {
    // We want to reference auther form the autherModel collection
    type: mongoose.Schema.Types.ObjectId, // it is just telling mongoose that to reference to another object
    required: true,
    ref: "Auther",
  },
});
const bookData = mongoose.model("Book", bookSchema);

export default bookData;
