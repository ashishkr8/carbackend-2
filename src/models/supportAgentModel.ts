import mongoose, { Schema, Document, Model } from 'mongoose';

interface ISupport {
  name: string;
}

// Extend Document so Mongoose model methods work well with TypeScript
export interface ISupportDocument extends ISupport, Document {}

const supportAgentSchema: Schema<ISupportDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SupportAgentModel: Model<ISupportDocument> = mongoose.model<ISupportDocument>(
  'SupportAgent',
  supportAgentSchema
);

export default SupportAgentModel;
