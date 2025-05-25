import express from "express";
import { getPersonalInfo, updatePersonalInfo } from "../controllers/userControllers/personalInfo";
import { getAgents, getClients } from "../controllers/userControllers/getAgentsAndClient";
import changePassword from "../controllers/userControllers/changePassword";
import getUserBookings from "../controllers/bookingControllers/getUserBookings";
import { getDocuments, updateDocuments } from "../controllers/userControllers/documents";

const router = express.Router();

router
.put("/:userId/change-password", changePassword)
.get("/:userId/personal-info", getPersonalInfo)
.put("/:userId/update/personal-info", updatePersonalInfo)
.get("/agents", getAgents)
.get("/clients", getClients)
.get("/user/:userId", getUserBookings)
.get("/docs/:userId", getDocuments)
.post("/docs/:userId/upload-docs", updateDocuments);

export default router;
