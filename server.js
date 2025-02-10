import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import storyRoutes from "./routes/storyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

configDotenv();

const allowedOrigins = ["http://localhost:5173", "https://dreyxinx.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
const PORT = process.env.PORT || 2007;

app.use("/api/story", storyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/author", authorRoutes);

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
//   secure: true,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: (req, file) => {
//     const fileName = path.parse(file.originalname).name;
//     return {
//       folder: "stories",
//       allowedFormats: ["jpg", "png"],
//       transformation: [{ width: 50, height: 50, crop: "limit" }],
//       public_id: fileName,
//     };
//   },
// });

// const upload = multer({ storage: storage });

// app.post("/api/upload", upload.single("image"), (req, res) => {
//   const file = req.file;
//   try {
//     res.json({ url: file.path });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });


app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
