import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getUser,
} from "../controller/user.controller.js";
import { handleSignup } from "../controller/handleSignup.controller.js";
import {
  getLoggedInUser,
  handleLogin,
} from "../controller/handleLogin.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { logOut } from "../controller/logout.controller.js";
import { handleRefreshToken } from "../controller/handleRefreshToken.controller.js";

const router = Router();

router.get("/get-users", getUsers);
router.get("/get-user/:id", getUser);
router.get("/get-loggedIn-user", getLoggedInUser);
router.get("/refresh-token", handleRefreshToken);
router.post("/logout", logOut);
router.post("/add-user", addUser);
router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
