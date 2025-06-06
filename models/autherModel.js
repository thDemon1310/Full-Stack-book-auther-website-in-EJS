import mongoose from "mongoose";

const autherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const autherData = mongoose.model("Auther", autherSchema);


export default autherData;
