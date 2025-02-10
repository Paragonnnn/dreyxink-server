import mongoose, { Schema, model } from "mongoose";
import bycrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    fullname: { type: String },
    role: {
      type: String,
      enum: ["admin", "author", "reader"],
      default: "reader",
    },
    bio: { type: String },
    profile_picture: { type: String },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Story" }],
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycrypt.hash(this.password, 10);
  next();
});

const User = model("User", userSchema);

export default User;
