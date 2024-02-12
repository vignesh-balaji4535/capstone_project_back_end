import express from "express";
import { getAllAdmins, loginAdmin, registerAdmin } from "../controllers/admin_controller.js";

const Router = express.Router();

// posting a new admin -Account Creating
Router.post("/register", registerAdmin);

//Login a admin --post method;
Router.post("/login", loginAdmin);

//getting all admin user's
Router.get("/allAdmins",getAllAdmins);

export const AdminRouter = Router;
