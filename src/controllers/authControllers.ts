import { Request, Response } from "express";
import User from "../models/authModels";
import { generateToken } from "../utils/authUtils";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      res.status(400).json({ error: "Name, phone and password are required" });
      return;
    }

    if (phone.length < 8 || phone.length > 11 ) {
      res.status(400).json({ error: "Phone number must be at least 8 digits" });
      return;
    }

    if (password.length < 8 || password.length > 20) {
      res.status(400).json({ error: "Password must be between 8 and 20 characters" });
      return;
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      res.status(409).json({ error: "Phone number already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({  message: "User created successfully", data: { id: newUser._id, name, phone} })
  } catch (err) {
    res.status(400).json({ message: "Registration failed", error: (err as Error).message });
  }
};

/**
 * @desc   Login user with phone and password
 * @route  POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ error: "Phone and password are required" });
      return;
    }

    if (phone.length < 8) {
      res.status(400).json({ error: "Phone number must be at least 8 digits" });
      return;
    }

    if (password.length < 8 || password.length > 20) {
      res.status(400).json({ error: "Password must be between 8 and 20 characters" });
      return;
    }

    const user = await User.findOne({ phone });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const token = generateToken({
      userId: user._id.toString(),
      name: user.name,
      phone: user.phone
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ message: "Login failed", error: (err as Error).message });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userObj = req.user.toObject?.() ?? req.user;
    const { passwordHash, ...safeUser } = userObj;

    res.status(200).json({ data: safeUser, message: `Welcome back, ${safeUser.name}`, });
  } catch (error) {
    console.error("Error in user auth route:", error);
    res.status(500).json({ message: "Error fetching user", error: (error as Error).message });
  }
};
