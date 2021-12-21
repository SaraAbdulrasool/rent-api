const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    fName: {
      type: String,
      required: [true, "Please enter your first name"],
    },
    lName: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    password: {
      type: String,
      required: [true, "Please nte your password"],
      minlength: [8, "Minimum length is 8 characters"],
    },
    email: {
      type: String,
      required: [true, "{lease enter your email"],
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
      minlength: [8, "Minimum length is 8 characters"],
    },
    birthDate: {
      type: String,
      required: [true, "Please enter your birth date"],
    },
    address: {
      type: String,
      required: [true, "Please enter your address"],
    },
    role: {
      type: String,
      required: [true, "Please select the role"],
    },
  },
  { timestamps: true }
);

//fire function before doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Password is inccorect");
  }
  throw Error("This email is inccorect");
};

const User = mongoose.model("User", userSchema);
module.exports = User;
