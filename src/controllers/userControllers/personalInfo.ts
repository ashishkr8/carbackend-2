import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Users from "../../models/User";

export const getPersonalInfo = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await Users.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    clientId: user?.id,
    email: user?.email,
    firstName: user?.username,
    imageUrl: user?.imageUrl,
    lastName: user?.surname,
    phoneNumber: user?.phone,
    country: user?.address?.country,
    city: user?.address?.city,
    postalCode: user?.address?.postalCode,
    street: user?.address?.street
  });
});

export const updatePersonalInfo = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    firstName,
    lastName,
    phoneNumber,
    imageUrl,
    country,
    city,
    postalCode,
    street
  } = req.body;

  console.log("Request body:", req.body, userId);

  const user = await Users.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.username = firstName || user.username;
  user.surname = lastName || user.surname;
  user.phone = phoneNumber || user.phone;
  user.imageUrl = imageUrl || user.imageUrl;

  user.address = {
    country: country || user.address?.country || "",
    city: city || user.address?.city || "",
    postalCode: postalCode || user.address?.postalCode || "",
    street: street || user.address?.street || ""
  };

  await user.save();

  res.status(200).json({ message: "User information updated successfully" });
});
