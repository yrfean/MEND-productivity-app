import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import User from "../Schemas/userSchema.js";
import Blocked from "../Schemas/blockedSchema.js";
import { Model } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express from "express";
const app = express();
app.use(cors());

// Sign Up
const signUp = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const blocked = await Blocked.findOne({ email });
    if (blocked) {
      return res.status(400).json({ message: "user is blocked" });
    }

    const hashedPassword = await hashPassword(password, 10);

    const userSave = new User({
      userName,
      email,
      password: hashedPassword,
    });
    await userSave.save();

    const token = await generateToken(email);
    res.status(201).json({
      _id: userSave._id,
      token,
      message: "Signup successful!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error, try again later" });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const blocked = await Blocked.findOne({ email });
    if (blocked) {
      return res.status(400).json({ message: "User is blocked" });
    }

    // Check if it's the admin
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASS
    ) {
      const token = await generateToken(email);
      return res.json({
        message: "oh its admin!",
        token,
        role: "admin",
      });
    }

    // Regular user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No such user" });
    }

    const checked = await comparePassword(password, user.password);
    if (!checked) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = await generateToken(email);
    res.json({ message: "User login successful", token, role: "user" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET USer

const getUser = async (req, res) => {
  const email = req.user;
  const user = await User.findOne({ email });

  // console.log(user)
  if (!email) return res.status(404).json({ message: "user not found" });

  res.status(200).json({ message: "user is send", data: user });
};

// FORGOT PASSWORD

const forgotPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const blocked = await Blocked.findOne({ email });
    if (blocked) {
      return res.status(400).json({ message: "user is blocked" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "couldn't update password" });
  }
};

// Add Task
const addTask = async (req, res) => {
  const { title, description, dueDate, dueTime } = req.body.values;
  // console.log(dueDate);
  const email = req.user;
  // console.log({email})

  const blocked = await Blocked.findOne({ email });
  if (blocked) {
    return res.status(400).json({ message: "user is blocked" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newTask = {
      title,
      description,
      completed: false,
      dueDate,
      dueTime,
    };
    console.log(newTask);
    user.task.push(newTask);
    // console.log(user.task.push(newTask));
    await user.save();
    // console.log(user);

    const createdTask = user.task[user.task.length - 1];
    res
      .status(201)
      .json({ message: "Task added successfully", task: createdTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Task
const updateTask = async (req, res) => {
  const { taskId, title, description, completed } = req.body;
  const email = req.user;
  // console.log("got here");

  const blocked = await Blocked.findOne({ email });
  if (blocked) {
    return res.status(400).json({ message: "user is blocked" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const task = user.task.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (title) task.title = title;
    if (description) task.description = description;
    if (typeof completed === "boolean") task.completed = completed;

    await user.save();
    res.json({ message: "Task updated successfully", tasks: user.task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  // console.log("delete triggeredd");
  const { taskId } = req.body;
  // console.log(taskId)
  const email = req.user;
  // console.log("delete task email:",email)

  const blocked = await Blocked.findOne({ email });
  if (blocked) {
    return res.status(400).json({ message: "user is blocked" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.task = user.task.filter((task) => task._id.toString() !== taskId);
    await user.save();

    res.json({ message: "Task deleted successfully", tasks: user.task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
  // console.log("fetching got here though");
  const email = await req.user;
  // console.log(email);
  try {
    const blocked = await Blocked.findOne({ email });
    if (blocked) {
      return res.status(400).json({ message: "user is blocked" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // console.log(user.task);
    return res.json({ tasks: user.task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE IMAGE

const updateImage = async (req, res) => {
  const email = req.user;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "non user found" });
    }

    if (!req.file) {
      return res.status(400).json("no image file attached");
    }

    user.image = `https://mend-backend-7e2c.onrender.com/${req.file.filename}`;
    await user.save();

    return res
      .status(200)
      .json({ message: "image uploading successful", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "image uploading unsuccessful", error: error.message });
  }
};

// UPDATE PROFILE

const updateProfile = async (req, res) => {
  const { email, userName, password } = req.body;
  // console.log(userName, password);
  // console.log("update profile working");

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "no user" });
    }

    user.userName = userName;
    user.password = password;
    user.save();
    return res
      .status(201)
      .json({ message: "profile updation successfull", user });
  } catch (err) {
    return res
      .status(404)
      .json({ message: `error in finding and updating profile ${err}` });
  }
};

// GOOGLE SIGNIN
const googleSignin = async (req, res) => {
  const { email, name } = req.body;
  console.log("first");
  const blocked = await Blocked.findOne({ email });
  if (blocked) {
    return res.status(400).json({ message: "user is blocked" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      // SIGN-UP
      const signUp = new User({ email, userName: name });
      await signUp.save();
      console.log("signup completed");
    } else if (user) {
      // LOGIN
      console.log("login successfull");
    }
    const token = await generateToken(email);
    console.log(token);

    res.status(200).json({ message: "hell yeah", token });
    // console.log("YESSSS");
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "google pattichu" });
  }
};

// ADMIN GET USERS

const getUsers = async (req, res) => {
  // console.log("admin get users frist")
  try {
    const users = await User.find({});
    res.status(200).json({ message: "users are send", users });
  } catch (error) {
    res.status(500).json({ message: "internal server errrrrrrrrrrrrror" });
  }
};

// ADMIN USER DELETE

const userDelete = async (req, res) => {
  // console.log("deleting first")
  const { id } = req.body;
  const { email } = req.body;
  // console.log(id);
  try {
    // const blockUser = new Blocked({ email });
    // await blockUser.save();
    const user = await User.findByIdAndDelete(id);

    // console.log(user);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "internal server erreor" });
  }
};

// user block

const userBlock = async (req, res) => {
  const { email } = req.body;
  const exists = await Blocked.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already blocked" });

  const user = new Blocked({ email });
  await user.save();
  console.log(user);
  res.status(200).json({ message: "blocked user" });
};

// USER UNBLOCK

const userUnBlock = async (req, res) => {
  const { email } = req.body;
  const exists = await Blocked.findOne({ email });
  if (!exists) return res.status(401).json({ message: "User is not blocked" });

  await Blocked.deleteOne({ email });
  res.status(200).json({ message: "user unblocked" });
};

const blockedEmail = async (req, res) => {
  const blockedEmails = await Blocked.find({});
  res.status(200).json({ message: "got blocked email", blockedEmails });
};

const quotesFetching = async (req, res) => {
  const response = await fetch("https://zenquotes.io/api/quotes");
  const quotes = await response.json();
  res.json(quotes);
  // console.log(quotes);
};

export {
  signUp,
  quotesFetching,
  blockedEmail,
  userUnBlock,
  userBlock,
  userDelete,
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
};
