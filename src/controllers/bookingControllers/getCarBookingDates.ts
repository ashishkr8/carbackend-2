import bookingDates from "../../models/bookingDates";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const getCarBookingDates = asyncHandler(async (req: Request, res: Response) => {
  const { carId } = req.params;

  if (!carId || typeof carId !== "string") {
    res.status(400);
    throw new Error("carId is required as query param");
  }

  const dates = await bookingDates.find({ carId });

  const datesModified = dates.map((date) => ({
    pickUpDateTime: date.pickUpDateTime,
    dropOffDateTime: date.dropOffDateTime,
  }));

  res.status(200).json({
    dates: datesModified,
  });
});

export default getCarBookingDates;
