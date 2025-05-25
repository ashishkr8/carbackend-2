import mongoose, {Schema,Document,Model, model} from 'mongoose';

interface IDocs {
  userId:string,
  passportDetails:{
    frontSide:string,
    backSide:string
  }
  drivingLicence:{
    frontSide:string,
    backSide:string
  }
}

const docsSchema:Schema<IDocs> = new Schema({
  userId: { type: String, required: true },
  passportDetails: {
    frontSide: { type: String, required: true },
    backSide: { type: String, required: true }
  },
  drivingLicence: {
    frontSide: { type: String, required: true },
    backSide: { type: String, required: true }
  }
}, { timestamps: true });

export default model<IDocs>('Documents', docsSchema);
export type IDocsModel = Document & IDocs;