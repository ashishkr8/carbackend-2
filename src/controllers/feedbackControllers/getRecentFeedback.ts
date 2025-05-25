import Feedback from "../../models/feedbackModel";
import Cars from "../../models/Car";
import Bookings from "../../models/bookingModel";
import { DateTime } from "luxon";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../../models/User";

const getRecentFeedback = asyncHandler(async (req: Request, res: Response) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(10);

  const carIds = [...new Set(feedbacks.map((f) => f.carId))];
  const clientIds = [...new Set(feedbacks.map((f)=>f.clientId))]
  const bookingIds = [...new Set(feedbacks.map((f) => f.bookingId))];

  const cars = await Cars.find({ id: { $in: carIds } });
  const clients = await User.find({ id: { $in: clientIds } });
  const bookings = await Bookings.find({ id: { $in: bookingIds } });

  const carMap = new Map(
    cars.map((car) => [
      car.id,
      {
        carModel: car.model,
        carImageUrl: car.images[0],
      },
    ])
  );

  const bookingMap = new Map(
    bookings.map((booking) => {
      const dateFormatted = DateTime.fromJSDate(booking.createdAt).toFormat("dd.MM.yyyy");
      return [
        booking.id,
        {
          date: dateFormatted,
          orderHistory: `#${booking.bookingNumber} (${dateFormatted})`,
        },
      ];
    })
  );

  const clientMap = new Map(
    clients.map((client) => [
      client.id,
      {
        name: `${client.username} ${client.surname}`,
      }
    ])
  );

  const modifiedFeedbacks = feedbacks.map((f) => {
    const car = carMap.get(f.carId);
    const booking = bookingMap.get(f.bookingId);
    const client = clientMap.get(f.clientId);

    return {
      author: client?.name, // Add author data if available
      carImageUrl: car?.carImageUrl ?? "",
      carModel: car?.carModel ?? "Unknown",
      date: booking?.date ?? "",
      feedbackId: f?.id,
      feedbackText: f?.feedbackText,
      orderHistory: booking?.orderHistory ?? "",
      rating: f?.rating.toString(),
    };
  });

  res.status(200).json({ content: modifiedFeedbacks });
});

export default getRecentFeedback;
