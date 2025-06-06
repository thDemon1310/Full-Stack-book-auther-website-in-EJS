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
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  auther: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Auther",
  },
});

bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    const imgPath = `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    return imgPath;
  }
});

const bookData = mongoose.model("Book", bookSchema);

export default bookData;