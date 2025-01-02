import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import storyRoutes from "./routes/storyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authorRoutes from './routes/authorRoutes.js'

configDotenv();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "https://dreyxinx.vercel.app",
  credentials: true,
}))
const PORT = process.env.PORT || 2007;

app.use("/api/story", storyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/author", authorRoutes)

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
