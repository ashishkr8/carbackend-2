import Bookings from "../../models/bookingModel";
import bookingDates from "../../models/bookingDates";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { DateTime } from "luxon";

const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  if (!bookingId || typeof bookingId !== "string") {
    res.status(400);
    throw new Error("bookingId is required as a query parameter");
  }

  const canceledBooking = await Bookings.findOne({ _id: bookingId });

  if (!canceledBooking) {
    res.status(400);
    throw new Error("Booking does not exist");
  }

  const bookingTime = DateTime.fromJSDate(canceledBooking.createdAt);
  const now = DateTime.now();

  const diffInHours = now.diff(bookingTime, "hours").hours;

  if (diffInHours > 12) {
    res.status(400);
    throw new Error("Booking can't be cancelled after 12 hours of creation");
  }

  await bookingDates.deleteOne({ _id: canceledBooking.bookingDateId });
  
  canceledBooking.bookingStatus = "CANCELLED";
  canceledBooking.save();

  res.status(200).json({ message: "Booking successfully deleted" });
});

export default cancelBooking;
