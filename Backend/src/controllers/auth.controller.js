// src/controllers/auth.controller.js
import { User } from "../models/userModel.js";
import { validateAndFormatPhoneNumber } from "../utils/phoneUtils.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, contactNumber, dob } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const formattedPhone = validateAndFormatPhoneNumber(contactNumber);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      contactNumber: formattedPhone,
      dob,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const user = req.user;
    user.refreshToken = null;
    await user.save();
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = (req, res) => {
  const user = req.user;
  return res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    contactNumber: user.contactNumber,
    dob: user.dob
  });
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, contactNumber, dob } = req.body;

    if (contactNumber) {
      user.contactNumber = validateAndFormatPhoneNumber(contactNumber);
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.dob = dob || user.dob;

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    const isMatch = await user.isPasswordCorrect(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // You would normally generate a token and send an email here
    return res.status(200).json({ message: "Password reset link sent (mock)" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
