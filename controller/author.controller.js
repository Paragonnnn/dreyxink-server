import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { configDotenv } from "dotenv";

configDotenv();

export const addAuthor = async (req, res) => {
  res.send("add author");
};

export const getAuthors = async (req, res) => {
  res.send("get authors");
};

export const getAuthor = async (req, res) => {
  res.send("get author");
};

export const updateAuthor = async (req, res) => {
  res.send("update author");
};

export const deleteAuthor = async (req, res) => {
  res.send("delete author");
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const fileName = `${path.parse(file.originalname).name}${new Date().getTime()}`;
    return {
      folder: "Stories_images",
      allowedFormats: ["jpg", "png"],
      public_id: fileName,
    };
  },
});

export const upload = multer({ storage: storage });


export const uploadStoryImage = async (req, res) => {
  const file = req.file;
  console.log(req.file);
  try {
    
    res.json({ url: file.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


