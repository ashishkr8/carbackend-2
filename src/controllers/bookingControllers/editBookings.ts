import Bookings from "../../models/bookingModel";
import bookingDates from "../../models/bookingDates";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { DateTime } from "luxon";

const editBookings = asyncHandler(async (req: Request, res: Response) => {
  const {bookingId} = req.params;
  const {
    
    dropOffDateTime,
    dropOffLocationId,
    pickupDateTime,
    pickupLocationId,
  } = req.body;
  console.log(bookingId);

  console.log(dropOffDateTime, dropOffLocationId, pickupDateTime, pickupLocationId);

  if (!bookingId || !dropOffDateTime || !pickupDateTime) {
    res.status(400);
    throw new Error("bookingId, pickupDateTime, and dropOffDateTime are required");
  }

  const existingBooking = await Bookings.findOne({ _id: bookingId });
  console.log(existingBooking);

  if (!existingBooking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const carId = existingBooking.carId;

  const newPickup = DateTime.fromISO(pickupDateTime);
  const newDropoff = DateTime.fromISO(dropOffDateTime);

  if (newPickup >= newDropoff) {
    res.status(400);
    throw new Error("Pickup date must be before drop-off date");
  }

  // ✅ Conflict check: ignore current bookingId, check other bookings for this car
  const existingDates = await bookingDates.find({ carId });
  
  const hasConflict = existingDates.some((booking) => {
    if (booking.bookingId === bookingId) return false;

    const existingPickup = DateTime.fromISO(booking.pickUpDateTime.toISOString());
    const existingDropoff = DateTime.fromISO(booking.dropOffDateTime.toISOString());

    return newPickup < existingDropoff && newDropoff > existingPickup;
  });

  if (hasConflict) {
    res.status(409).json({ message: "not available" });
    return;
  }

  // ✅ Update locations
  if (dropOffLocationId) existingBooking.dropOffLocationId = dropOffLocationId;
  if (pickupLocationId) existingBooking.pickupLocationId = pickupLocationId;
  await existingBooking.save();


  // ✅ Update booking dates
  const currentDates = await bookingDates.findOne({ bookingId });
  if (!currentDates) {
    res.status(404);
    throw new Error("Associated booking dates not found");
  }

  console.log(currentDates);

  currentDates.pickUpDateTime = pickupDateTime;
  currentDates.dropOffDateTime = dropOffDateTime;
  await currentDates.save();

  res.status(200).json({
    bookingId: existingBooking.id,
    message: "Booking successfully updated",
  });
});

export default editBookings;
