import mongoose from "mongoose";

export function connectToMongoDb() {
  const params = {};

  mongoose
    .connect(process.env.DB_URL, params)
    .then(() => console.log(`CONNECTED TO ATLAS-DB `))
    .catch((err) => console.log(err.message));
}
