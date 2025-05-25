import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../../models/User";

export const getAgents = asyncHandler(async(req:Request, res:Response) => {
      const { dateFrom, dateTo, carId, locationId, supportAgentId } = req.query;

  const query: any = {};

  if (dateFrom || dateTo) {
    query.pickupDateTime = {};
    if (dateFrom) query.pickupDateTime.$gte = new Date(dateFrom as string);
    if (dateTo) query.pickupDateTime.$lte = new Date(dateTo as string);
  }

  if(carId) query.carId = carId;
  if(locationId) query.locationId = locationId;
  if(supportAgentId) query.supportAgentId = supportAgentId;

  
})


export const getClients = asyncHandler(async(req:Request, res:Response) => {
    const user = await User.find({ role: "Client" });
    if (!user) {
        res.status(404);
        throw new Error("No clients found");
    }

    const clients = user.map((client) => ({
        id: client.id,
        username: `${client.username} ${client.surname}`,
    }));

    res.status(200).json({content:clients});
})

