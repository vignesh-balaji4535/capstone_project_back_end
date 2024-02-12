import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  adminName: {
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
    minlength: 6,
  },
  addedMovie: [
    {
      type: mongoose.Types.ObjectId,
      ref:"Movie"
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);

export { Admin };
