import { getCars, getCarsBookedDays, getCarsWithId,getCarsClientReview,getCarsPopular } from "../controllers/carControllers/carController";
import createCars from "../controllers/carControllers/createCars";
import express from "express";


const router = express.Router()

router
.get("/", getCars)
.post("/", createCars)
.get("/:carId", getCarsWithId)
.get("/:carId/booked-days", getCarsBookedDays)
.get("/:carId/client-review", getCarsClientReview)
.get("/popular", getCarsPopular)


export default router
