import Bookings from "../../models/bookingModel";
import Cars from "../../models/Car";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const getUserBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    const error: any = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const userBookings = await Bookings.find({ clientId: userId });

  const userBookingsModified = await Promise.all(
    userBookings.map(async (booking) => {
      const car = await Cars.findOne({ carId: booking.carId });

      // Format createdAt date as DD.MM.YYYY
      const createdAt = new Date(booking.createdAt);
      const formattedDate = `${String(createdAt.getDate()).padStart(2, "0")}.${String(
        createdAt.getMonth() + 1
      ).padStart(2, "0")}.${createdAt.getFullYear()}`;

      return {
        carId: booking.carId,
        bookingId: booking.id,
        carImageUrl: car?.images[0],
        carModel: car?.model,
        bookingStatus:booking.bookingStatus||"RESERVED",
        orderDetails: `#${booking.bookingNumber} (${formattedDate})`,
      };
    })
  );

  res.status(200).json({ content: userBookingsModified });
});

export default getUserBookings;
