const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// schema design
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide your name."],
      trim: true,
      minLength: [3, "Too short name."],
      maxLength: [50, "Name is too large."],
    },
    email: {
      type: String,
      required: [true, "Please Provide your email."],
      unique: [true, "email is already exist."],
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
        message: "Please provide a valid email.",
      },
    },
    password: {
      type: String,
      required: [true, "Please Provide your password."],
    },
    age: {
      type: Number,
      required: [true, "Please provide Your age."],
      min: [1, "Age can't be less than 1."],
    },
    address: {
      type: String,
      required: [true, "Please Provide your address."],
      trim: true,
      minLength: [3, "Too short name."],
      maxLength: [150, "Name is too large."],
    },
    phone: {
      type: String,
      required: [true, "Please Provide your phone number."],
      trim: true,
      minLength: [11, "Phone number should be 11 digit."],
      maxLength: [11, "Phone number should be 11 digit."],
    },
    nid: {
      type: String,
      required: [true, "Please Provide your Nid."],
    },
    profilePic: {
      type: String,
      required: [true, "Please Provide a profile pic."],
    },
    vehicleType: {
      type: String,
      required: [true, "Please Provide your vehicle type."],
      enum: {
        values: ["car", "bike"],
        message: "vehicleType should be car or bike",
      },
    },
    status: {
      type: String,
      required: [true, "required."],
      default: "active",
      enum: {
        values: ["active", "blocked"],
        message: "Status should be active or blocked",
      },
    },
    type: {
      type: String,
      required: [true, "required."],
      enum: {
        values: ["rider", "learner", "admin"],
        message: "type should be rider or learner",
      },
    },
    payment: {
      type: Number,
    },
    paymentID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const password = this.password;
  const hashPassword = bcrypt.hashSync(password);
  this.password = hashPassword;
  next();
});

userSchema.methods.verifyPassword = function (password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
};

// Model
exports.User = mongoose.model("User", userSchema);
