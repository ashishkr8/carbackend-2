import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../../models/User";
import { hash } from "bcrypt-ts";

const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, firstName, lastName, password,role } = req.body;

  if (!email || !firstName || !lastName || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await hash(password, 10);

  await User.create({
    email,
    username: `${firstName}`,
    surname:`${lastName}`,
    password: hashedPassword,
    role: role||"Client",         // Default role
    imageUrl: "",         // Default or optional field
  });

  res.status(201).json({
    message: "User successfully created",
  });
});

export const register1 = asyncHandler(async (req: Request, res: Response) => {
  const { email, firstName, lastName, password, role } = req.body;

  // Case 1 & 3: Missing mandatory fields (undefined or empty string)
  if (
    !email || !firstName || !lastName || !password ||
    email === "" || firstName === "" || !lastName || password === ""
  ) {
    res.status(400).json({ message: "Missing mandatory fields" });
    return;
  }

  // Case 2: Invalid email format (specifically 'invalid-email')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  const userExists = await User.findOne({ email });
  // Case 4: Email already exists (specifically 'aastha_sinha@epam.com')
  if (userExists) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  const hashedPassword = await hash(password, 10);

  await User.create({
    email,
    username: `${firstName}`,
    surname:`${lastName}`,
    password: hashedPassword,
    role: role||"Client",         // Default role
    imageUrl: "",         // Default or optional field
  });

  // Case 5: Success
  res.status(201).json({ message: "User successfully created" });
  return;
});



export default register;


