import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Sub-document interface
interface IFilter {
  dateFrom?: Date;
  dateTo?: Date;
  locationId?: Types.ObjectId;
  carId?: Types.ObjectId;
  supportAgentId?: Types.ObjectId;
}

// Main document interface
export interface IReport extends Document {
  filters: IFilter;
}

const filterSchema = new Schema<IFilter>(
  {
    dateFrom: { type: Date },
    dateTo: { type: Date },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location' },
    carId: { type: Schema.Types.ObjectId, ref: 'Car' },
    supportAgentId: { type: Schema.Types.ObjectId, ref: 'SupportAgent' },
  },
  { _id: false }
);

const reportSchema = new Schema<IReport>(
  {
    filters: { type: filterSchema, required: true },
  },
  { timestamps: true }
);

const ReportModel: Model<IReport> = mongoose.model<IReport>('Report', reportSchema);

export default ReportModel;
