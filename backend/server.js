import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();
app.use(express.json()); //!"It is middleware. If a request contains JSON data, parse it and make it available through req.body."

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Todo API is working with  Nodemon");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
