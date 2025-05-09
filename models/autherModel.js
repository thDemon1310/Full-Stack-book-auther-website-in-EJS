import mongoose from "mongoose";

// What is Schema?
// in MongoDB and non-sequal database the schema is like the table

// building schema
const autherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const autherData = mongoose.model("Auther", autherSchema);


export default autherData;
