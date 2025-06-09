import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, TaskZen API!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
