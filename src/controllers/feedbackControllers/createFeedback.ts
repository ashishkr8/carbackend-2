import Feedback from "../../models/feedbackModel";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { bookingId, carId, clientId, feedbackText, rating } = req.body;

  if (!bookingId || !carId || !clientId || !feedbackText || rating == null) {
    const error: any = new Error("All fields are mandatory");
    error.statusCode = 400;
    throw error;
  }

  const newFeedback = await Feedback.create({
    bookingId,
    carId,
    clientId,
    feedbackText,
    rating: Number(rating),
  });

  res.status(201).json({
    feedbackId: newFeedback.id,
    systemMessage: "Feedback has been successfully created",
  });
});

export default createFeedback;
