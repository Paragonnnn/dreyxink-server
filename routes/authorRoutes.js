import { Router } from "express";

import {
  addAuthor,
  getAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} from "../controller/author.controller.js";


const router = Router();

router.get("/get-authors", getAuthors);
router.post("/add-author", addAuthor);
router.get("/get-author/:id", getAuthor);
router.put("/update-author/:id", updateAuthor);
router.delete("/delete-author/:id", deleteAuthor);

export default router;