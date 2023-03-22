const authControllers = require("../controllers/auth.controller");
const allControllers = require("../controllers/all.controller");
const uploader = require("../middleware/uploader");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const stripe = require("stripe")(process.env.STRIPE_KYE);

const fields = [
  { name: "nid", maxCount: 1 },
  { name: "drivingLicence", maxCount: 1 },
  { name: "profilePic", maxCount: 1 },
];

router
  .route("/registration")
  .post(uploader.fields(fields), authControllers.signup);
router.route("/login").post(authControllers.login);

router.route("/create-payment-intent").post(async (req, res) => {
  const { vehicleType } = req.body;
  const amount = vehicleType === "car" ? 20000 : 10000;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

router.use(verifyToken);
router.route("/update-payment-info").post(allControllers.payment);
router
  .route("/list")
  .get(allControllers.getAllUser)
  .patch(allControllers.updateUser);

module.exports = router;
