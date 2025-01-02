import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    story_id: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

export default Comment;
