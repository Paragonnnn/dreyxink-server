import mongoose, { Schema, model } from "mongoose";

const replySchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

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
    user_name: {
      type: String,
      required: true,
    },
    content: { type: String, required: true },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

const LikeSchema = new Schema({
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
});


const ChapterSchema = new Schema(
  {
    title: { type: String, required: true },
    content: {type: Object, required: true},
    chhapter_number: { type: Number, required: true },
    likes: [LikeSchema],
    likes_count: { type: Number, default: 0 },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);



const storySchema = new Schema(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    // category_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },
    categories: [{ type: String, required: true }],
    title: { type: String, required: true},
    chapters: [ChapterSchema],
    summary: { type: String, required: true},
    cover_image: { type: String },
    comments: [commentSchema],
    likes: [LikeSchema],
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Story = model("Story", storySchema);

export default Story;
