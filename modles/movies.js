import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  actors: [
    {
      type: String,
      required: true,
    },
  ],
  discription: {
    type: String,
    require: true,
  },
  releaseDate: {
    type: Date,
    require: true,
  },
  posterUrl: {
    type: String,
    require: true,
  },
  featured: {
    type: Boolean,
  },
  admin: [
    { type: mongoose.Types.ObjectId,
      ref:"Admin"
    }],
    longPoster:{
      type:String,
      require:true,
    },
  bookings: [{
    type: mongoose.Types.ObjectId,
    ref:'Booking',
  }],
});

const Movie = mongoose.model("Movie", movieSchema);

export { Movie };
