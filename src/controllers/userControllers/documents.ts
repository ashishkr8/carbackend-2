import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Documents from "../../models/docsModel";
import User from "../../models/User";

export const getDocuments = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const docs = await Documents.findOne({ userId });
  if (!docs) {
    res.status(404).json({ message: "Documents not found" });
    return;
  }

  res.status(200).json(docs);
});

export const updateDocuments = asyncHandler(async (req: Request, res: Response) => {
  console.log("inside updateDocuments");
  const { userId } = req.params;
  const { passportDetails, drivingLicence } = req.body;

  console.log("Request body:", userId);
  console.log(passportDetails, drivingLicence);

  const user = await User.findOne({_id:userId});
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
    console.log(userId);

  let document = await Documents.findOne({ userId });

  if (document) {
    if (passportDetails?.frontSide) document.passportDetails.frontSide = passportDetails.frontSide;
    if (passportDetails?.backSide) document.passportDetails.backSide = passportDetails.backSide;
    if (drivingLicence?.frontSide) document.drivingLicence.frontSide = drivingLicence.frontSide;
    if (drivingLicence?.backSide) document.drivingLicence.backSide = drivingLicence.backSide;

    await document.save();
  } else {
    document = await Documents.create({
      userId,
      passportDetails: {
        frontSide: passportDetails?.frontSide || "",
        backSide: passportDetails?.backSide || ""
      },
      drivingLicence: {
        frontSide: drivingLicence?.frontSide || "",
        backSide: drivingLicence?.backSide || ""
      }
    });

  }

  res.status(200).json({ message: "Documents updated successfully", document });
});
