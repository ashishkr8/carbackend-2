import mongoose, {Schema,Document,Model} from 'mongoose';

interface IAddress {
  country:string,
  city:string,
  postalCode:string,
  street:string
}


interface IUser extends Document{
  email:string,
  password:string,
  username:string,
  surname:string,
  imageUrl:string,
  phone:string,
  address:IAddress,
  role:'Client'|'Admin'|'Agent'
}

const userSchema:Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  username: { type: String, required: true },
  surname: { type: String },
  imageUrl: { type: String },
  phone: {type: String},
  address: {
      country:{type: String},
      city:{type: String},
      postalCode:{type: String},
      street:{type: String}
  },
  role: { type: String, enum: ['Client', 'Admin', 'Agent'], default: 'Client' },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
