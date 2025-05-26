import Bookings from "../../models/bookingModel";
import Cars from "../../models/Car";
import User from "../../models/User";
import bookingDates from "../../models/bookingDates";
import { DateTime } from "luxon";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const getFilterBookings = asyncHandler(async (req: Request, res: Response) => {
  const { dateFrom, dateTo, clientId } = req.query;

  const dateQuery: any = {};

  if (dateFrom) dateQuery.pickUpDateTime = { $gte: new Date(dateFrom as string) };
  if (dateTo) {
    dateQuery.dropOffDateTime = { 
      ...(dateQuery.dropOffDateTime || {}), 
      $lte: new Date(dateTo as string) 
    };
  }

  const filteredDates = await bookingDates.find(dateQuery);

  if( filteredDates.length === 0) {
    res.status(404).json({ message: "No bookings found for the specified dates." });
    return;
  }

  const bookingIds = filteredDates.map((bd) => bd.bookingId).filter(Boolean);

  let bookingQuery: any = { _id: { $in: bookingIds } };
  if (clientId) {
    bookingQuery.clientId = clientId;
  }

  const allBookings = await Bookings.find(bookingQuery);
  // console.log("All bookings:", allBookings);

  const carIds = [...new Set(allBookings.map((b) => b.carId))];
  const cars = await Cars.find({ carId: { $in: carIds } });
  const carMap = new Map(cars.map((car) => [car.carId, car.model]));
  // console.log("Car map:", carMap);

  const clientIds = [...new Set(allBookings.map((b) => b.clientId))];
  const clients = await User.find({ _id: { $in: clientIds } });
  const clientMap = new Map(clients.map((client) => [client.id, `${client.username} ${client.surname}`]));

  const dateMap = new Map(filteredDates.map((d) => [d.bookingId, d]));

  const allBookingsModified = allBookings.map((item) => {
    const dateRecord = dateMap.get(item.id);
    const pickup = DateTime.fromJSDate(dateRecord?.pickUpDateTime || new Date());
    const dropoff = DateTime.fromJSDate(dateRecord?.dropOffDateTime || new Date());
    const bookingPeriod = `${pickup.toFormat("MMM dd")} - ${dropoff.toFormat("MMM dd")}`;
    const bookingDate = DateTime.fromJSDate(item.createdAt).toFormat("dd.MM.yy");
    const clientId = item.clientId || "Unknown";

    return {
      bookingId: item._id,
      bookingNumber: item.bookingNumber,
      BookingPeriod: bookingPeriod,
      carModel: carMap.get(item.carId) || "Unknown",
      clientName: clientMap.get(clientId)||"Unknown", // Placeholder if client model is added later
      date: bookingDate,
      location: item.pickupLocationId,
      madeBy: "Client",
    };
  });

  res.status(200).json({ content: allBookingsModified });
});

export default getFilterBookings;
