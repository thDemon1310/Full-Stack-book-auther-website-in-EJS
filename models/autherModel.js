import mongoose from "mongoose";
import Book from "./bookModel.js";
const autherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

autherSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(" Running pre-deleteOne for author:");

    try {
      const books = await Book.find({ auther: this._id });
      if (books.length > 0) {
        return next(
          new Error("This author has books linked and cannot be deleted.")
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }
);
const autherData = mongoose.model("Auther", autherSchema);
export default autherData;
