import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/users.model.js";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const usernameUser = await User.findOne({ username: username });
    const emailUser = await User.findOne({ email: username });
    const user = usernameUser || emailUser;
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password incorrect" });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log(refreshToken)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ success: true, message: "User logged in", accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoggedInUser = async (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log(token);
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      const loggedInUser = await User.findById(user.id);
      console.log(loggedInUser);
      res.status(200).json({ success: true, user: loggedInUser });
    });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

