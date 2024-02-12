import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { Admin } from "../modles/admin.js";
env.config();

//ADMIN REGISTERARION REQUEST

export const registerAdmin = async (req, res, next) => {
  //getting user data from request body
  const { adminName, email, password } = req.body;
  let adminCheck;
  let newadmin;
  try {
    // checking email already exist
    adminCheck = await Admin.findOne({ email });

    if (adminCheck) {
      return res.status(401).send("admin Already Exists");
    }

    //salt creating & hashing password
    const salt = await bcryptjs.genSalt(10);
    let hashedPassword = await bcryptjs.hash(password, salt);

    //post new admin to db....

    newadmin = new Admin({ ...req.body, password: hashedPassword });

    // storing data in db using .save() method
    await newadmin.save();
  } catch (error) {
    res.status(500).send(error);
  }

  res.status(200).json({ newadmin });
};

// ADMIN LOGIN REQUEST

export const loginAdmin = async (req, res, next) => {
  // destructuring req.body input's
  const { email, password } = req.body;
  let admin;
  try {
    // checking email already exist
    admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .send("Admin User not exist , pls Register your account");
    }

    //password checking using bcryptjs compare method

    let passwordMatch = await bcryptjs.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(400).send("Incorrect Password");
    }

    // creating json web token using jwt sign with user detailes as pay load and secrect key
    let Admintoken = jwt.sign(
      { adminName: admin.adminName, admin_id: admin._id, email: admin.email },
      process.env.SECRECT_KEY
    );

    return res.status(200).send({ Admintoken, admin });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllAdmins = async (req, res, next) => {
  let admins;

  try {
    admins = await Admin.find();

    if (!admins) {
      return res.status(500).send("internal server Error");
    }

    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send(error);
  }
};
