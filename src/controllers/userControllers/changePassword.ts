import asyncHandler from "express-async-handler";
import { compare, hash } from 'bcrypt-ts'; // Make sure this is the correct bcrypt package for your project
import { Request, Response } from "express";
import Users from "../../models/User";

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const {userId} = req.params;
  const {currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Email, current password and new password are required");
  }

  const user = await Users.findOne({ _id:userId });


  if (!user) {
    res.status(400);
    throw new Error("User doesn't exist");
  }

  // Await the async compare function
  const match = await compare(currentPassword, user.password);

  if (!match) {
    res.status(400);
    throw new Error("The password is wrong! Try another one");
  }

  const saltRounds = 10;                     //also implement this thing in signup
  const newHashedPassword = await hash(newPassword, saltRounds);

  user.password = newHashedPassword;

  await user.save();

  res.status(201).json({
    message: "Password changed successfully",
  });
});

export default changePassword;
