const express = require("express");
const paymentCtrl = require("../../api/payment");
const Joi = require("joi");
const httpStatus = require("http-status");
const APIResponse = require("../../APIResponse");
const router = express.Router(); // eslint-disable-line new-cap
const { validate } = require("../../middlewares");
const passport = require("passport");

router.get("/getAllPayment", paymentCtrl.getAllPayment.handler);
router.get("/getAll", paymentCtrl.getAllForDownload.handler);
router.get("/getAll/getMonthlyData", paymentCtrl.getMonthlyData.handler);
router.post("/checkPayment", paymentCtrl.checkPayment.handler);
router.put("/pay", paymentCtrl.createPayment.pay);
// router.post("/pay-product", auth, paymentCtrl.payProduct);
// router.post("/donate", auth, paymentCtrl.Donate);
// router.post("/confirmDonation", auth, paymentCtrl.confirmDonation);
// router.get("/get-donation-details", auth, paymentCtrl.getDonationDetails);
// router.post("/payout", auth, paymentCtrl.Payout);
// router.post("/subscription", auth, paymentCtrl.subscription);
// router.post("/confirmSubscription", auth, paymentCtrl.confirmSubscription);

module.exports = exports = router;
