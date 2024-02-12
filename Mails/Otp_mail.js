
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";



export  function sendOtpUser(user){

  console.log(user)
  const otpToken= user.resetPasswordToken;

  const {token }= jwt.verify(otpToken,process.env.SECRECT_KEY)

  console.log(token,"hello world")
   

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vigneshbalaji453535@gmail.com',
      pass: 'fffs mmdd hgbg envi'
    }
  });
  
  

  var mailOptions = {
    from: 'vigneshbalaji453535@gmail.com',
    to: `${user.email}`,
    subject: `OTP -${token}`,
    text: `Your have recived a mail for password reset Request for your account,
    please use the follow OTP to reset your password :
    
             OTP- : ${token}.
    
    if you didn't request for password reset , kindly 
    ignore this mail`,
    
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}