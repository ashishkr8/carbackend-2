import register from "../controllers/authControllers/register";
import login from "../controllers/authControllers/login";
import express from "express";
import editBookings from "../controllers/bookingControllers/editBookings";
import cancelBooking from "../controllers/bookingControllers/cancelBookings";
import bookedCarDetails from "../controllers/bookingControllers/bookedCarDetails";
import getUserBookings from "../controllers/bookingControllers/getUserBookings";
import getCarBookingDates from "../controllers/bookingControllers/getCarBookingDates";
import createBookings from "../controllers/bookingControllers/createBookings";
import getFilterBookings from "../controllers/bookingControllers/getFilterBookings";


const router = express.Router()

router
.get("/", getFilterBookings) 
.post("/",createBookings)
.get("/car/:bookingId", bookedCarDetails)
.post("/cancel/:bookingId", cancelBooking)
.post("/edit/:bookingId",editBookings)
.get('/user/:userId', getUserBookings)
.get('/dates/:carId', getCarBookingDates)

.get('/:userId', getUserBookings)



export default router
