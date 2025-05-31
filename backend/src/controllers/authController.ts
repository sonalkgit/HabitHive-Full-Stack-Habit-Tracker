import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import generateToken from '../utils/generateToken';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("jjjjjjjjjjjjjjjjjj", req.body)
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ email, password: hashedPassword });
    console.log("kkkkkkkk", user)
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
