import User from "../models/users.model.js";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

configDotenv();

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addUser = async (req, res) => {
  const user = req.body;
  if (!user.username || !user.password || !user.email || !user.full_name) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  const newUser = new User(user);
  try {
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  try {
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const existingUsername = await User.findOne({ username: updates.username });
  const existingUser = await User.findOne({ email: updates.email });

  try {
    // Check if the username is being updated and if it already exists
    if (!updates.username) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide username" });
    }
    if (!updates.email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email" });
    }
    if (updates.username) {
      const existingUsername = await User.findOne({
        username: updates.username,
      });
      if (existingUsername && existingUsername._id.toString() !== id) {
        return res
          .status(400)
          .json({ success: false, message: "Username already exists" });
      }
    }

    // Check if the email is being updated and if it already exists
    if (updates.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }
    }
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid user ID" });
  }
  try {
    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkIfUsernameExist = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    res.json({ exists: !!user }); // Returns { exists: true/false }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkIfEmailExist = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    res.json({ exists: !!user }); // Returns { exists: true/false }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
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
    const fileName = path.parse(file.originalname).name;
    return {
      folder: "stories",
      allowedFormats: ["jpg", "png"],
      transformation: [{ width: 250, height: 250, crop: "limit" }],
      public_id: fileName,
    };
  },
});

export const upload = multer({ storage: storage });

export const uploadProfilePicture = async (req, res) => {
  const file = req.file;
  try {
    res.json({ url: file.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleBookmark = async (req, res) => {
  const { id } = req.params;
  const { story_id, userId } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const bookmarkIndex = user.bookmarks.indexOf(story_id);

    if (bookmarkIndex === -1) {
      user.bookmarks.push(story_id);
    } else {
      user.bookmarks.pull(story_id);
    }

    await user.save();
    // const updatedUser = await user.populate("bookmarks");

    res.json({
      success: true,
      message: bookmarkIndex === -1 ? "Story bookmarked" : "Bookmark removed",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("bookmarks");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
