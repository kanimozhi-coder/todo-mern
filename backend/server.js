import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Todo API is working with  Nodemon");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
