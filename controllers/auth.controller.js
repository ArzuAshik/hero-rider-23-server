const { Rider } = require("../models/Rider");
const { User } = require("../models/User");
const { generateToken } = require("../utils/token");

exports.signup = async (req, res) => {
  console.log("reg");
  try {
    const userData = req.body;

    const files = req?.files;
    if (files?.nid?.length) {
      userData.nid = files.nid[0]?.filename;
    }
    if (files?.profilePic?.length) {
      userData.profilePic = files.profilePic[0]?.filename;
    }

    const { type } = userData;
    let user;
    if (type === "rider") {
      if (files?.drivingLicence?.length) {
        userData.drivingLicence = files?.drivingLicence[0].filename;
      }
      user = new Rider(userData);
    } else {
      user = new User(userData);
    }
    await user.save();
    const { password, ...data } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Signup Successful.",
      data,
      token: generateToken(data),
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password)
    return res.status(401).json({ message: "email and password is required." });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "No user found with this email." });
    }
    const isPasswordMatched = user.verifyPassword(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({ message: "incorrect email or password." });
    }

    const {
      password: pd,
      createdAt,
      updatedAt,
      __t,
      __v,
      ...data
    } = user.toObject();
    res.status(200).json({
      success: true,
      message: "Login Successful.",
      token: generateToken(data),
      data,
    });
  } catch (error) {
    res.send(error);
  }
};
