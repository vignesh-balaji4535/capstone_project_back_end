import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToMongoDb } from "./db.js";
import { UserRouter } from "./routers/user.js";
import { MovieRouter } from "./routers/movie.js";
import { AdminRouter } from "./routers/admin.js";
import { BookingRouter } from "./routers/booking.js";
dotenv.config();

const App = express();

//.json()method is used to using json input as payload
App.use(express.json());

// to conneting front end and back end
App.use(cors());

// middleware's

App.use("/api/user", UserRouter);
App.use("/api/admin", AdminRouter);
App.use("/api/movie", MovieRouter);
App.use("/api/booking", BookingRouter);

// server starting point ........................................

App.listen(process.env.PORT, () => {
  console.log(`SERVER CONNECTED SUCCESSFULLY WITH PORT :${process.env.PORT}`);
});

//CONNECTING TO ATLAS MONGO-DB
connectToMongoDb();
