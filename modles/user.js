import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  resetPasswordToken:{
    type:String,

  },
  resetPasswordExp:{
    type:String,
  },
  bookings:[
    {type:mongoose.Types.ObjectId,
    ref:"Booking"}
  ]
});

const User = mongoose.model("User", userSchema);

export { User };
