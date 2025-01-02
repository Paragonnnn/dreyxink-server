import mongoose, { Schema,model } from "mongoose";


const authorSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pen_name: { type: String },
  bio: { type: String },
});

const Author = model("Author", authorSchema);

export default Author;