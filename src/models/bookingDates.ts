import mongoose, {Schema, Document} from "mongoose"

interface IDates{
    bookingId:string,
    carId:string,
    pickUpDateTime: Date
    dropOffDateTime: Date
}

const bookingDateSchema = new Schema<IDates>({
    bookingId:{type:String},
    carId:{type:String, required:true},
    pickUpDateTime: { type: Date, required: true },
    dropOffDateTime: { type: Date, required: true }
})

export default mongoose.model<IDates>('BookingDates', bookingDateSchema);

