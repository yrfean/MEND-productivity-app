import express from "express";
import dotenv from "dotenv";
import connectDb from "./DBconnection/dbConnecting.js";
import {
  signUp,
  login,
  addTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getUser,
  updateProfile,
  updateImage,
  googleSignin,
  forgotPassword,
  getUsers,
  userDelete,
  userBlock,
  userUnBlock,
  blockedEmail,
  quotesFetching,
} from "./Controllers/userController.js";
import cors from "cors";
import auth from "./utils/auth.js";
import uplaod from "./utils/multer.js";
import path from "path";
const app = express();

app.use(cors());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
dotenv.config();
app.use(express.json());
connectDb();

// User routes
app.post("/signup", signUp);
app.post("/login", login);
app.get("/getUser", auth, getUser);
app.post("/updateImage", auth, uplaod, updateImage);
app.put("/updateprofile", auth, updateProfile);
app.post("/forgotPassword", forgotPassword);

// admin user controlling
app.get("/getUsers", getUsers);
app.post("/userDelete", userDelete);
app.post("/userBlock", userBlock);
app.post("/userUnBlock", userUnBlock);
app.get("/blockedEmails", blockedEmail);

// Google sinin
app.post("/googleSignin", googleSignin);

// quotes fetching
app.get("/fetchQuotes", quotesFetching);

// Task routes
app.post("/addTask", auth, addTask); // Add a new task
app.put("/updateTask", auth, updateTask); // Update a task
app.delete("/deleteTask", auth, deleteTask); // Delete a task
app.get("/getAlltasks", auth, getAllTasks); // Get all tasks

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
