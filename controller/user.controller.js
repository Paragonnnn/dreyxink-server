import User from "../models/users.model.js";
import mongoose from "mongoose";

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
  const user = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid user ID" });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid user ID" });
    }
    try {
        await User.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
