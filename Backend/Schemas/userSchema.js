import { time } from "console";
import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
    isDarkMode: {
      type: Boolean,
      default: false,
    },

    task: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        dueDate: {
          type: Date,
          required: false,
        },
        dueTime: {
          type: String,
          required: false,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;
