import express from 'express'
import createFeedback from '../controllers/feedbackControllers/createFeedback';
import getRecentFeedback from '../controllers/feedbackControllers/getRecentFeedback';
import getCarFeedback from '../controllers/feedbackControllers/getCarsFeedback';

const router = express.Router();

router
.post("/", createFeedback)
.get("/", getRecentFeedback)
.get("/:carId", getCarFeedback)

const router1 = express.Router()
router1
.get("/recent", getRecentFeedback)
.post("/", createFeedback)

export { router1 as feedbackRoutes1 }
export { router as feedbackRoutes }