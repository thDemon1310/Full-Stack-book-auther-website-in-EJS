import mongoose from "mongoose";

// What is Schema?
// in MongoDB and non-sequal database the schema is like the table

// building schema
const autherData = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const autherSchema = mongoose.model("Auther", autherData);


export default autherSchema;
