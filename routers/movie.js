import express from "express";
import dotenv from "dotenv";
import { createNewMovie, getAllMovies, getMovies } from "../controllers/movie_controller.js";
dotenv.config();

const Router = express.Router();


Router.get('/',getAllMovies);

Router.get('/:id',getMovies);

Router.post('/create',createNewMovie);

export const MovieRouter = Router;