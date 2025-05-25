// Adjusted for bookingDates model usage
import Car from '../../models/Car';
import Review from '../../models/Review';
import Feedbacks from '../../models/feedbackModel';
import Booking from '../../models/bookingModel';
import bookingDates from '../../models/bookingDates';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from '../../models/User';

// GET /cars
export const getCars = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    gearBoxType,
    fuelType,
    minPrice,
    maxPrice,
    page = '1',
    size = '8',
  } = req.query;

  const filters: any = {};

  if (category) filters.category = category;
  if (gearBoxType) filters.gearBoxType = gearBoxType;
  if (fuelType) filters.fuelType = fuelType;
  if (minPrice || maxPrice) {
    filters.pricePerDay = {};
    if (minPrice) filters.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) filters.pricePerDay.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(size);
  const totalElements = await Car.countDocuments(filters);
  const totalPages = Math.ceil(totalElements / Number(size));

  const cars = await Car.find(filters).skip(skip).limit(Number(size));

  const content = cars.map((car) => ({
    carId: car.carId,
    carRating: car.carRating,
    imageUrl: car.images[0],
    location: car.location,
    model: car.model,
    pricePerDay: car.pricePerDay,
    serviceRating: car.serviceRating,
    status: car.status,
  }));

  res.status(200).json({ content, currentPage: Number(page), totalElements, totalPages });
});

// GET /cars/{carId}
export const getCarsWithId = asyncHandler(async (req: Request, res: Response) => {
  const { carId } = req.params;

  const car = await Car.findOne({carId});
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  res.status(200).json({
    carId: car.carId,
    carRating: car.carRating,
    climateControlOption: car.climateControlOption,
    engineCapacity: car.engineCapacity,
    fuelConsumption: car.fuelConsumption,
    fuelType: car.fuelType,
    gearBoxType: car.gearBoxType,
    images: car.images,
    location: car.location,
    model: car.model,
    numberOfSeats: car.passengerCapacity,
    pricePerDay: car.pricePerDay,
    serviceRating: car.serviceRating,
    status: car.status,
    type: "SEDAN",
    vin: "VIN123456789",
    year: "2023"
  });
});

// GET /cars/{carId}/booked-days
export const getCarsBookedDays = asyncHandler(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const bookings = await bookingDates.find({ carId });

  const bookedDaysSet = new Set<string>();
  bookings.forEach((booking) => {
    const start = new Date(booking.pickUpDateTime);
    const end = new Date(booking.dropOffDateTime);
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      bookedDaysSet.add(new Date(date).toISOString().split('T')[0]);
    }
  });

  res.status(200).json({ content: [...bookedDaysSet] });
});


export const getCarsClientReview = asyncHandler(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const page = parseInt(req.query.page as string) || 0;
  const size = parseInt(req.query.size as string) || 10;
  const sort = (req.query.sort as string) || 'DATE';
  const direction = (req.query.direction as string) || 'DESC';

  const sortField = sort === 'DATE' ? 'createdAt' : 'rating';
  const sortOrder = direction === 'DESC' ? -1 : 1;

  const totalElements = await Feedbacks.countDocuments({ carId });
  const totalPages = Math.ceil(totalElements / size);

  const reviews = await Feedbacks.find({ carId })
    .sort({ [sortField]: sortOrder })
    .skip(page * size)
    .limit(size);

  const clientIds = [...new Set(reviews.map((r) => r.clientId?.toString()))];
  const clients = await User.find({ _id: { $in: clientIds } });
  const clientMap = new Map(
    clients.map((client) => [
      client.id.toString(),
      {
        name: `${client.username} ${client.surname}`,
        imageUrl: client.imageUrl || null,
      },
    ])
  );

  const content = reviews.map((r) => {
    const clientInfo = clientMap.get(r.clientId?.toString());
    return {
      author: clientInfo?.name || "Unknown",
      authorImageUrl: clientInfo?.imageUrl || "https://i.pravatar.cc/150?u=default", // fallback image
      date: r.createdAt.toISOString().split('T')[0],
      rentalExperience: r.rating,
      text: r.feedbackText,
    };
  });

  res.status(200).json({
    content,
    currentPage: page,
    totalElements,
    totalPages,
  });
});


// GET /cars/popular
export const getCarsPopular = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  const filters: any = {};

  if (category) filters.category = category;

  const cars = await Car.find(filters).sort({ rating: -1 }).limit(10);

  const content = cars.map((car) => ({
    carId: car.carId,
    carRating: car.carRating,
    imageUrl: car.images,
    location: car.location,
    model: car.model,
    pricePerDay: car.pricePerDay,
    serviceRating: car.serviceRating,
    status: car.status,
  }));

  res.status(200).json({ content });
});