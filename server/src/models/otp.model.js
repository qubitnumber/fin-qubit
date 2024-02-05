import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const Schema = mongoose.Schema;

const OtpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp:  {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5,  // in 5 minutes
    },  
  },
  { toJSON: { getters: true } }
);

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
      <p>Here is your OTP code: ${otp}, which is effective in 5 minutes.</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
};

OtpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("OTP", OtpSchema);

export default OTP;
