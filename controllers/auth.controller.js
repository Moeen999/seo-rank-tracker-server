import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/genToken.js";

// User register Controller
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const isAlreadyRegistered = await User.findOne({ email });
    if (isAlreadyRegistered) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const saltedValue = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltedValue);

    const user = await User.create({
      name,
      email,
      password,
    });
    await User.save();
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: "Registered Succesfully",
      token,
      user,
    });
  } catch (error) {
    console.log("Register error: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// User Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: "Login Succesfully",
      token,
      user,
    });
  } catch (error) {
    console.log("Register error: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get User Controller
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log("Error getting user: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
