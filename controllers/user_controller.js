import { User } from "../modles/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { Booking } from "../modles/booking.js";
import { sendOtpUser } from "../Mails/Otp_mail.js";
env.config();

//********************************************************************************
// GEETING ALL USER'S FROM DB
export const getAllUser = async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (error) {
    return next(error);
  }

  if (!users) {
    return res.status(500).json({ message: "unexprected error occured" });
  }

  return res.status(200).json({ users });
};

//****************************************************************************************************
//REGISTERING THE NEW USER BU POST METHOD


export const registerUser = async (req, res, next) => {
  try {
    // checking email already exist
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(404).send("User Already Exists");
    }

    //salt creating & hashing password
    const salt = await bcryptjs.genSalt(10);
    let hashedPassword = await bcryptjs.hash(password, salt);

    //post new user to db....

    let newUser = new User({ ...req.body, password: hashedPassword });


    await newUser.save();

    
    //create user_token (jwt)

    let Usertoken = jwt.sign(
      { username: newUser.username, email: newUser.email },
      process.env.SECRECT_KEY
    );
   return res.status(200).send({Usertoken,newUser});
  } catch (error) {
   return res.status(404).send(error.message);
  }
};

//***********************************************************************************************************
//LOGING USER TO THE APP AND CREATING THE JSON WEB TOKEN

export const loginUser = async (req, res, next) => {
  try {
    // destructuring req.body input's
    const { email, password } = req.body;

    // checking email already exist
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send("User not exist , pls Register your account First");
    }

    //password checking using bcryptjs compare method

    let passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send("Incorrect Password");
    }

    let Usertoken = jwt.sign(
      { username: user.username, email: user.email },
      process.env.SECRECT_KEY
    );
    return res.status(200).send({ Usertoken ,user });
  } catch (error) {
   return res.status(404).send(error.message);
  }
};

// **********************************************************************************
//USER NAME UPDATING BY PUT METHOD

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { username } = req.body;

  if (!username && username.trim() === "") {
    return res.status(422).send("invaild input");
  }

  let user;
  try {
    user = await User.findByIdAndUpdate(id, { username: username });
  } catch (error) {
    res.status(500).send(error);

  }
  if (!user) {
    return res.status(400).send("somthing went error");
  }

 return res.status(200).send("Successfully Updated");
};

// ********************************************************************************************
// ACCOUNT DELETING PROCESS BY USING DELETE METHOD

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndDelete(id, {});
  } catch (error) {
     return res.status(500).send(error);

  }

  if (!user) {
    return res.status(404).send("invaild user");
  }

 return res.status(200).send("User deleted successfully");
};


//get user bookins by id 

export const getUserBookingById =async (req,res,next)=>{

const user_id = req.params.id;

let userBooking;


try {
  
  userBooking = await Booking.find({user:user_id})
  .populate("movie")
      .populate("user");;


  if(!userBooking){
    return res.status(500).send("user booking not found")
  }

 return res.status(200).send(userBooking)

} catch (error) {
 return res.status(500).send(error);

}

}

export const forgotPassword=async(req,res,next)=>{
  
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid User or Email");
    }

    const hideToken = jwt.sign(
      { token: Math.random().toString().slice(-4) },
      process.env.SECRECT_KEY,
      { expiresIn: "5m" }
    );

    user.resetPasswordToken = hideToken;
    user.resetPasswordExp = Date.now() + 36000000;

    await user.save();

    sendOtpUser(user);

    return res.status(200).send({
      message: "otp sent",
      token: hideToken,
      date: user.resetPasswordExp,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

//validating otp --forgot password request

export const otpVerify = async(req,res,next)=>{

  const { token } = req.params;
  const { otp } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
    });
    if (!user) {
      return res.status(401).send("Invalid Token");
    }

    const otpToken = user.resetPasswordToken;

    const { token: token1 } = jwt.verify(otpToken, process.env.SECRECT_KEY);


    if (otp == token1) {
      return res.status(200).send("Correct OTP");
    } else {
      return res.status(400).send("Incorrect OTP");
    }
  } catch (error) {
   return res.status(500).send(error);
  }

}

//rest user password 

export const passwordRest = async (req,res,next)=>{
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
    });

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExp = null;

    await user.save();

    return res.status(200).send("updated successfully");
  } catch (error) {
 return   res.status(500).send(error);
  }

}