const { User } = require("../models/User");

exports.getAllUser = async (req, res, next) => {
  const user = req.user;
  console.log(user);
  if (user.type !== "admin") {
    res.status(200).json({ error: true, message: "You are not an admin." });
  }
  let {
    page = "1",
    limit = "10",
    search = "",
    minAge = 1,
    maxAge = 100,
  } = req.query;
  page = Number(page);
  limit = Number(limit);
  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ],
    age: { $gte: minAge, $lte: maxAge },
    type: { $ne: "admin" },
  };

  try {
    const data = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const documentCount = await User.countDocuments(query);

    res.status(200).json({
      documentCount,
      totalPage: Math.ceil(documentCount / limit),
      currentPage: page,
      data,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const user = req.user;
  console.log(user);
  if (user.type !== "admin") {
    res.status(200).json({ error: true, message: "You are not an admin." });
  }

  const { email, status } = req.body;

  try {
    const { modifiedCount } = await User.updateOne({ email }, { status });

    if (modifiedCount) {
      res.status(200).json({
        success: true,
        message: `${email} is ${status}`,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Update Failed",
      });
    }
  } catch (error) {
    res.send(error);
  }
};

exports.payment = async (req, res, next) => {
  const { email } = req.user;
  const { payment, paymentID } = req.body;

  try {
    const { modifiedCount } = await User.updateOne(
      { email },
      { payment, paymentID }
    );

    if (modifiedCount) {
      res.status(200).json({
        success: true,
        message: `Payment Successful $${payment}. Your Payment ID is ${paymentID}`,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Payment Failed",
      });
    }
  } catch (error) {
    res.send(error);
  }
};
