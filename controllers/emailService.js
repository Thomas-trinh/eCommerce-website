import nodemailer from "nodemailer";
import  dotenv  from 'dotenv';

dotenv.config({ path: './controllers/.env' });


export const transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    host: "smtp.gmail.com",
    service: "Gmail",
    tls: {
        rejectUnauthorized: false
    },
    auth:{ //get details from env file
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    }
});


export default transporter;

//  const mailOptions = {
//      from: 'ecocampusexchange@gmail.com',
//      to: 'siripothuri24@gmail.com',
//      subject: 'Password Reset Request',
//      text: 'Hi -username-, here is your link to reset your password.'
//    };

export function sendResetEmail(mailOptions){
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
          } else {
            
            console.log("Email sent: " + info.response);
            return result = 1;
            // res.redirect(`/`);
            // console.log(req.cookies.token);
            
        }
    })
};