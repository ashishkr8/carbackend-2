import Feedback from "../../models/feedbackModel";
import User from "../../models/User";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { carId } = req.params;

  if (!carId) {
    res.status(400);
    throw new Error("Car ID is required");
  }

  const carFeedback = await Feedback.find({ carId });

  const carFeedbackModified = await Promise.all(
    carFeedback.map(async (feedback) => {
      const user = await User.findById(feedback.clientId);
      const firstname = user?.username || "";
      const lastname = user?.surname || "";
      const imageUrl = user?.imageUrl || "";

      return {
        name: `${firstname} ${lastname}`,
        photo: imageUrl,
        stars: feedback.rating,
        review: feedback.feedbackText,
        date: feedback.createdAt,
      };
    })
  );

  res.status(200).json({
    carFeedback: carFeedbackModified,
    carId: carId,
  });
});

export default createFeedback;
