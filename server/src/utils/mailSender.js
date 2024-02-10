//importing modules
import config from "config";
import nodemailer from "nodemailer";

//function to send email to the user
const sendingMail = async(email, title, body) =>{
  try {
    const mailOptions = {
      from: 'www.finqubit.com - Fin Qubit',
      to:`${email}`,
      subject: `${title}`,
      html: `${body}`,
    };

    const transporter = nodemailer.createTransport({
      host: config.util.getEnv('MailSmtpHost'),
      port: parseInt(config.util.getEnv('MailSmtpPort')),
      auth: {
        user: config.util.getEnv('MailSmtpUser'),
        pass: config.util.getEnv('MailSmtpPass')
      }
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully');
    return info
  } catch (error) {
    console.log(error.message);
  }
}

export default sendingMail;