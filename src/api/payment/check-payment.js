const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    const { uid, phone, vcid, ctid, cnid, tdid } = req.body;
    if (!vcid || !ctid || !cnid || !tdid) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FILL_DETAILS,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    try {
      if (uid) {
        checkPayment = await global.models.GLOBAL.PAYMENT.find({
          uid: uid,
          tdid: tdid,
          vcid: vcid,
          ctid: ctid,
          cnid: cnid,
          status: "done",
        });
      } else {
        checkPayment = await global.models.GLOBAL.PAYMENT.find({
          tdid: tdid,
          phone: phone,
          vcid: vcid,
          ctid: ctid,
          cnid: cnid,
          status: "done",
        });
      }
      if (checkPayment.length > 0) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ALREADY_PAY,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.ELIGIBLE_PAYMENT,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      }
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
      );
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
