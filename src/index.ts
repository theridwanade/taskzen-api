import express from "express";
import morgan from "morgan";
import "dotenv/config";
import authRoutes from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"))

app.get("/", (req, res) => {
  res.send("Hello, TaskZen API!");
});

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
