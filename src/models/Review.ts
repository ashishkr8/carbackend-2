// models/Review.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview {
  carId: string;
  author: string;
  authorImageUrl?: string;
  date?: Date;
  rentalExperience: string;
  text: string;
}

export interface IReviewDocument extends IReview, Document {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    carId: { type: String, required: true },
    author: { type: String, required: true },
    authorImageUrl: { type: String },
    date: { type: Date, default: Date.now },
    rentalExperience: { type: String, required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ReviewModel: Model<IReviewDocument> = mongoose.model<IReviewDocument>('Review', reviewSchema);

export default ReviewModel;
