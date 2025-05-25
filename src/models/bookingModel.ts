import mongoose, { Schema, Document, Model } from 'mongoose';

// Use require instead of import for mongoose-sequence
const mongooseSequence = require('mongoose-sequence')(mongoose);

export interface IBooking {
  carId: string;
  clientId: string;
  bookingDateId: string;
  dropOffLocationId: string;
  pickupLocationId: string;
  bookingNumber?: number;
  bookingStatus?:string,
  supportAgentId?: string;
}

export interface IBookingDocument extends IBooking, Document {
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBookingDocument>(
  {
    carId: { type: String, required: [true, 'carId is required'] },
    clientId: { type: String, required: [true, 'clientId is required'] },
    bookingDateId:{type:String,required:true},
    dropOffLocationId: { type: String, required: true },
    pickupLocationId: { type: String, required: true },
    bookingNumber: { type: Number },
    bookingStatus:{type:String, default:"RESERVED"},
    supportAgentId: { type: String },
  },
  {
    timestamps: true,
  }
);

// Now apply the plugin — this definitely returns a plugin function
bookingSchema.plugin(mongooseSequence, { inc_field: 'bookingNumber', start_seq: 1000 });

const BookingModel: Model<IBookingDocument> = mongoose.model<IBookingDocument>('Booking', bookingSchema);

export default BookingModel;
