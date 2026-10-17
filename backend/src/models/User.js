import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    // saved scrambled (hashed), never as typed. left out when we look up a user
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: false,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  {
    // saves when the user was created and last changed. no extra __v field
    timestamps: true,
    versionKey: false,
  },
);

// Export the model
const User = model("User", userSchema);
export default User;
