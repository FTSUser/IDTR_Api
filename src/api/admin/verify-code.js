const _ = require("lodash");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");
module.exports = exports = {
  // route validation
  validation: Joi.object({
    code: Joi.string().required(),
    // email: Joi.string().required(),
    phone: Joi.number().required(),
  }),
  // route handler
  handler: async (req, res) => {
    let { code, phone } = req.body;
    if (phone.length === 0 || code.length === 0) {
      logger.error("/verify-code - Phone number and code cannot be empty!");
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: "Phone number and code cannot be empty!",
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    // const phone = phone.removeSpaces();
    // Find the phone no and code object and then delete it.
    const roleExist = await global.models.GLOBAL.ROLE.findOne({
      roleName: "superadmin",
    });
    let verificationEntry;
    try {
      verificationEntry = await global.models.GLOBAL.CODE_VERIFICATION.findOne({
        phone: phone,
      });
    } catch (error) {
      logger.error(
        `/verify-code - Error encountered while verifying phone: ${error.message}\n${error.stack}`
      );
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: "Error",
        payload: { error: error },
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    if (!verificationEntry) {
      // SMS verification failed
      logger.error(
        `/verify-code - SMS verification for USER (phone: ${phone}) failed!`
      );
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.USER_DOES_NOT_EXIST,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    // Check number of attempts and expiryTime
    const now = moment();
    const expirationDate = moment(verificationEntry.expirationDate); // another date
    if (now.isAfter(expirationDate)) {
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.EXPIRED_VERIFICATION,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    if (verificationEntry.code !== code) {
      verificationEntry.failedAttempts++;
      await verificationEntry.save();
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FAILED_OTP,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.DUPLICATE_VALUE)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    /* SMS verification done */
    logger.info(
      `/verify-code - SMS verification for USER (phone: ${phone}) successful!`
    );
    // Find the phone no in user data if it exists or not.
    let user = await global.models.GLOBAL.ADMIN.findOne({
      phone: phone,
    }).populate({
      path: "role",
      model: "role",
      select: "_id roleName",
    });
    if (user !== null) {
      // User found - create JWT and return it
      const data4token = {
        // id: user._id,
        // date: new Date(),
        // environment: process.env.APP_ENVIRONMENT,
        // phone: phone,
        // email: user.email,
        // scope: "login",
        // roleId: user.role,
        // rolename: user.role.roleName,
        id: user._id,
        date: new Date(),
        environment: process.env.APP_ENVIRONMENT,
        phone: phone,
        scope: "login",
        type: roleExist.roleName,
        rolename: roleExist.roleName,
      };
      user.token = null;
      //   let findNavigation = await global.models.GLOBAL.NAVIGATION.find({
      //     roleId: user.role._id
      //   });
      const payload = {
        user: user,
        userExist: true,
        verified: true,
        token: jwt.sign(data4token, jwtOptions.secretOrKey),
        token_type: "Bearer",
        // Navigation: findNavigation
      };

      // LOGIN LOG
      let adminLoginLog = await global.models.GLOBAL.ADMINLOGINLOG({
        device: req.headers["user-agent"],
        ip: req.ip,
        uid: user._id,
      });
      await adminLoginLog.save();

      let data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.LOGIN_SUCCESS,
        payload: payload,
        logPayload: false,
      };
      // verificationEntry.delete();
      // !delete verification entry [Prodcution]
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } else {
      // Generate token and enter into the registration collection
      const payload = {
        phone: phone,
        date: new Date(),
        scope: "verification",
      };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      const entry = global.models.GLOBAL.CODE_REGISTRATION({
        phone: phone,
        code: token,
        date: Date.now(),
      });
      logger.info("/verify-code - Saving registration-code in database");
      try {
        await entry.save();
      } catch (error) {
        logger.error(
          `/verify-code - Error encountered while saving registration-code: ${error.message}\n${error.stack}`
        );
        let data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.USER_DOES_NOT_EXIST,
          payload: { error: error },
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      let data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.LOGIN_SUCCESS,
        payload: {
          userExist: false,
          verified: true,
          token: token,
        },
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
