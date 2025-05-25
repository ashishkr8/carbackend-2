import Bookings from "../../models/bookingModel";
import bookingDates from "../../models/bookingDates";
import Cars from "../../models/Car";

import { DateTime } from "luxon";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const createBookings = asyncHandler(async (req: Request, res: Response) => {
  const {
    carId,
    clientId,
    dropOffDateTime,
    dropOffLocationId,
    pickupDateTime,
    pickupLocationId,
  } = req.body;

  if (
    !carId ||
    !clientId ||
    !dropOffDateTime ||
    !dropOffLocationId ||
    !pickupDateTime ||
    !pickupLocationId
  ) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const newPickup = DateTime.fromISO(pickupDateTime);
  const newDropoff = DateTime.fromISO(dropOffDateTime);

  if (newPickup >= newDropoff) {
    res.status(400);
    throw new Error("Pickup date must be before drop-off date");
  }

  // Check for date conflicts
  const existingDates = await bookingDates.find({ carId });

  const hasConflict = existingDates.some((booking) => {
    const existingPickup = DateTime.fromISO(booking.pickUpDateTime.toISOString());
    const existingDropoff = DateTime.fromISO(booking.dropOffDateTime.toISOString());

    return (
      newPickup < existingDropoff && newDropoff > existingPickup
    );
  });

  if (hasConflict) {
    res.status(409).json({
      message: "not available",
    });
    return;
  }

  const bookedCar = await Cars.findOne({ carId });

  const newBookingDate = await bookingDates.create({
    carId,
    pickUpDateTime:pickupDateTime,
    dropOffDateTime,
  });

  const newBooking = await Bookings.create({
    carId,
    clientId,
    dropOffLocationId,
    pickupLocationId,
    bookingDateId: newBookingDate.id,
  });

  newBookingDate.bookingId = newBooking.id;
  await newBookingDate.save();

  const model = bookedCar ? bookedCar.model : "Unknown";

  const bookingInterval = `${newPickup.toFormat("MMM dd")} - ${newDropoff.toFormat("MMM dd")}`;
  const now = DateTime.now();
  const cancelDeadline = now.plus({ hours: 12 }).toFormat("hh:mm a dd MMM");
  const orderId = `#${newBooking.bookingNumber}`;
  const orderDate = now.toFormat("dd.MM.yy");

  res.status(201).json({
    bookingId: newBooking.id,
    message: `New booking was successfully created.\n${model} is booked for ${bookingInterval}\nYou can change booking details until ${cancelDeadline}.\nYour order: ${orderId} (${orderDate})`,
  });
});

export default createBookings;
