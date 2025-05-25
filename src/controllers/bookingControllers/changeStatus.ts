import Bookings from "../../models/bookingModel";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const changeStatus = asyncHandler(async(req:Request, res:Response) => {
    const {bookingId} = req.params;
    const {bookingStatus} = req.body;

    const currBooking = await Bookings.findOne({_id:bookingId})

    if(!currBooking){
        res.status(404);
        throw new Error("booking not found")

    }

    currBooking.bookingStatus = bookingStatus;

    currBooking.save();

    res.status(200).json({message:"status successfully changed"});
})