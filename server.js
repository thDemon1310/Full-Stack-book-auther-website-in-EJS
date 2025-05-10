if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

import express from "express";
import bodyParser from "body-parser";
const app = express();
const hostname = process.env.HOST;
const port = process.env.PORT;
import expressEjsLayouts from "express-ejs-layouts";
import { fileURLToPath } from "url";
import path from "path";
// importing routes
import indexRouter from "./routes/indexRoute.js";
import autherRoutes from "./routes/autherRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout"); // hookup express layout
app.use(expressEjsLayouts);
app.use(express.static("public")); // style, js, images
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

import mongoose from "mongoose";
await mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => {
  console.log(`Connection stablished to database`);
});

app.use("/", indexRouter);
app.use("/authers", autherRoutes);
app.use("/books", bookRoutes);

app.listen(port, () => {
  console.log(`The Server is running at http://${hostname}:${port}`);
});

