import { v4 as uuidv4 } from 'uuid';
import mongoose, { Schema, model, Document, Model } from 'mongoose';


// Define main Car interface without extending Document
export interface ICar {
  carId: string;
  carRating: string;
  serviceRating: string;
  climateControlOption: string;
  engineCapacity: string;
  fuelConsumption: string;
  fuelType: string;
  gearBoxType: string;
  images: string[];
  location: string;
  model: string;
  passengerCapacity: string;
  pricePerDay: string;
  carNumber: string;
  status: string;
  category: string;
  bookedDays: string[];

  mileageIncluded: string;
  additionalFeatures: string[];
  color: string;
  insuranceIncluded: string;
  pickupLocationId: string;
  dropOffLocationId: string;
  bookingModificationAllowedUntil: string;
}

// Main car schema
const carSchema = new Schema<ICar>(
  {
    carId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      required: true,
    },
    carRating: { type: String, required: true },
    serviceRating: { type: String, required: true },
    climateControlOption: { type: String, required: true },
    engineCapacity: { type: String, required: true },
    fuelConsumption: { type: String, required: true },
    fuelType: { type: String, required: true },
    gearBoxType: { type: String, required: true },
    images: { type: [String], required: true },
    location: { type: String, required: true },
    model: { type: String, required: true },
    passengerCapacity: { type: String },
    pricePerDay: { type: String, required: true },
    carNumber: { type: String, required: true },
    status: { type: String, default: 'AVAILABLE' },
    category: { type: String },
    bookedDays: { type: [String], default: [] },

    mileageIncluded: { type: String },
    additionalFeatures: { type: [String], default: [] },
    color: { type: String },
    insuranceIncluded: { type: String },
    pickupLocationId: { type: String },
    dropOffLocationId: { type: String },
    bookingModificationAllowedUntil: { type: String },
  },
  { timestamps: true }
);

const CarModel: Model<ICar> = model<ICar>('Car', carSchema);

export default CarModel;
