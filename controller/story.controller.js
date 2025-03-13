import Story from "../models/story.model.js";
import Comment from "../models/comment.model.js";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

configDotenv();

export const getStories = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (parseInt(page) - 1) * limit;
  const endIndex = parseInt(page) * limit;
  console.log(parseInt(page), parseInt(limit));

  try {
    const result = {};
    const stories = await Story.find();

    // const finalStories = stories.slice(startIndex, endIndex);
    if (startIndex > 0) {
      result.previous = {
        page: parseInt(page) - 1,
        limit: parseInt(limit),
      };
    }
    if (endIndex < stories.length) {
      result.next = {
        page: parseInt(page) + 1,
        limit: parseInt(limit),
      };
    }
    result.success = true;
    result.data = stories.slice(startIndex, endIndex);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const addStory = async (req, res) => {
  const body = req.body;

  try {
    const story = new Story(body);
    const newStory = await story.save();
    res
      .status(201)
      .json({ success: true, data: newStory, message: "Story added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStory = async (req, res) => {
  const { id } = req.params;
  try {
    const story = await Story.findById(id);
    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }
    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStoriesByAuthor = async (req, res) => {
  const { author_id } = req.params;
  try {
    const stories = await Story.find({ author_id });
    if (!stories) {
      return res
        .status(404)
        .json({ success: false, message: "Stories not found" });
    }
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStory = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid story ID" });
  }
  try {
    const updatedStory = await Story.findByIdAndUpdate(id, body, { new: true });
    res.status(200).json({ success: true, data: updatedStory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid story ID" });
  }
  try {
    await Story.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Story deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const comment = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid story ID" });
  }
  if (!comment.content) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a comment" });
  }
  try {
    const story = await Story.findById(id);
    story.comments.push(comment);
    // Comment.push(comment)
    story.comments_count = story.comments.length;
    await story.save();
    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(commentId)
  ) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid story ID or comment ID" });
  }
  try {
    const story = await Story.findById(id);
    const index = story.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    story.comments.splice(index, 1);
    story.comments_count = story.comments.length;
    // if (!comment) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Comment not found" });
    // }
    // story.comments.filter(
    //   (comment) => String(comment._id) !== String(commentId)
    // );
    // console.log(comment);
    await story.save();
    res
      .status(200)
      .json({ success: true, data: story, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likeStory = async (req, res) => {
  const { id } = req.params;
  const user_id = req.body.user_id;
  const body = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid story ID" });
  }
  try {
    const story = await Story.findById(id);
    const like = story.likes.find((l) => String(l.user_id) === String(user_id));
    if (like) {
      const unliked = story.likes.filter(
        (l) => String(l.user_id) !== String(user_id)
      );
      story.likes = unliked;
      story.likes_count = story.likes.length;
      await story.save();
      return res
        .status(200)
        .json({ success: true, data: story, message: "Story unliked" });
    }
    if (!like) {
      story.likes.push(body);
      story.likes_count = story.likes.length;
      await story.save();
      return res
        .status(200)
        .json({ success: true, data: story, message: "Story liked" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyComment = async (req, res) => {
  const { id } = req.params;
  const commentId = req.params.commentId;
  const reply = req.body;
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(commentId)
  ) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid story ID or comment ID" });
  }
  if (!reply.content) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a reply" });
  }
  try {
    const story = await Story.findById(id);
    const comment = story.comments.find(
      (c) => String(c._id) === String(commentId)
    );
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    comment.replies.push(reply);
    await story.save();
    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    const fileName = `${
      path.parse(file.originalname).name
    }${new Date().getTime()}`;
    return {
      folder: "stories",
      allowedFormats: ["jpg", "png"],
      transformation: [{ height: 256 }],
      public_id: fileName,
    };
  },
});

export const upload = multer({ storage: storage });

export const uploadCoverImage = async (req, res) => {
  const file = req.file;
  console.log(file);
  try {
    res.json({ url: file.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
