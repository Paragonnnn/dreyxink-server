import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/users.model.js";

dotenv.config();

export const handleSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUsername = await User.findOne({ username });
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const newUser = new User(req.body);

    await newUser.save();

    res.status(201).json({ success: true, message: "User Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
