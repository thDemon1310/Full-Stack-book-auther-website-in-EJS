if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

import express from "express";
import bodyParser from "body-parser";
import expressEjsLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// importing routes
import indexRouter from "./routes/indexRoute.js";
import autherRoutes from "./routes/autherRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();
const hostname = process.env.HOST || "localhost";
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");
app.use(expressEjsLayouts);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(express.static(path.join(__dirname, "public")));

await mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error("Database connection error:", error.message));
db.once("open", () => console.log("Connection established to database"));

// using routes
app.use("/", indexRouter);
app.use("/authers", autherRoutes);
app.use("/books", bookRoutes);

app.listen(port, () => {
  console.log(`The Server is running at http://${hostname}:${port}`);
});
