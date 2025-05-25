import mongoose, { Document, Schema, Model } from 'mongoose';

interface IFeedback {
  bookingId: string;
  carId: string;
  clientId: string;
  feedbackText: string;
  rating: number;
}

export interface IFeedbackDocument extends IFeedback, Document {
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedbackDocument>(
  {
    bookingId: { type: String, required: true },
    carId: { type: String, required: true },
    clientId: { type: String, required: true },
    feedbackText: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const FeedbackModel: Model<IFeedbackDocument> = mongoose.model<IFeedbackDocument>(
  'Feedback',
  feedbackSchema
);

export default FeedbackModel;