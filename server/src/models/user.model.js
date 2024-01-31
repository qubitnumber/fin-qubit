import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxLength: 32,
      select: false,
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    role: {
        type: String,
        default: 'user',
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

UserSchema.pre('save', async function(next) {   
  if (!this.isModified('password')) return next();
  if(this.password) {      
    this.password = await bcrypt.hash(this.password, 12);
  }                                                                                                                                                                          
  next()                                                                                                                                                                     
});

UserSchema.methods.comparePasswords = async function(hashedPassword, candidatePassword) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

const User = mongoose.model("User", UserSchema);

export default User;
