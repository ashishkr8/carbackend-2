import Bookings from "../../models/bookingModel";
import Car from "../../models/Car";
import bookingDates from "../../models/bookingDates";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const bookedCarDetails = asyncHandler(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    throw new Error("bookingId is required in the request parameters");
  }

  const booking = await Bookings.findOne({ _id: bookingId });

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const car = await Car.findOne({ carId: booking.carId });

  if (!car) {
    res.status(404);
    throw new Error("Car associated with the booking not found");
  }

  const bookedDate = await bookingDates.findOne({bookingId})

  const carDetails = {
    carId: car.carId,
    carRating:car.carRating,
    serviceRating:car.serviceRating,
    status:car.status,
    imageUrl: car.images[0],
    location: car.location,
    model: car.model,
    pricePerDay: car.pricePerDay,
  };

  res.status(200).json({carDetails, bookedDate});
});

export default bookedCarDetails;
