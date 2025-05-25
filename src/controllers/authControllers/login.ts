import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from "./../../models/User"
import { compare } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({ email });

  if (!user || !(await compare(password, user.password))) {
    res.status(400);
    throw new Error("Either email or password is incorrect");
  }

  if (!secretKey) {
    res.status(500);
    throw new Error("Server error: Secret key is not configured");
  }

  const token = jwt.sign(
    { name: user.username, email: user.email },
    secretKey,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    idToken: token,
    email:user.email,
    role: user.role,
    userId: user.id,
    imageUrl: user.imageUrl||"https://i.pravatar.cc/150?u=111",
    username: user.username,
    surname: user.surname,
    address: user.address
  });
});

export const login1 = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Case 1: Missing email or password
  if (!email || !password) {
    res.status(400).json({ message: "Missing email or password" });
    return;
  }

  // Find user by email
  const user = await User.findOne({ email });

  // Case 3: User not found or password incorrect
  if (!user || !(await compare(password, user.password))) {
    res.status(400).json({ message: "Invalid username/password supplied" });
    return;
  }

  // Case 4: Success - generate token and respond
  if (!secretKey) {
    res.status(500).json({ message: "Server error: Secret key is not configured" });
    return;
  }

  const token = jwt.sign(
    { name: user.username, email: user.email },
    secretKey,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    idToken: token,
    role: user.role,
    userId: user.id,
    userImageUrl: user.imageUrl||"https://i.pravatar.cc/150?u=111",
    username: `${user.username} ${user.surname}`,
  });
});

export default login;


