import Cars from "../../models/Car";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const createCars = asyncHandler(async (req: Request, res: Response) => {
  const { content } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (!Array.isArray(content) || content.length === 0) {
    res.status(400);
    throw new Error("Request body must contain a 'content' array with car data.");
  }

  try {
    await Promise.all(content.map((item) => Cars.create(item)));

    res.status(201).json({
      message: "Cars successfully created",
    });
  } catch (error: any) {
    res.status(400);
    throw new Error(`Something went wrong, error: ${error.message || error}`);
  }
});

export default createCars;
