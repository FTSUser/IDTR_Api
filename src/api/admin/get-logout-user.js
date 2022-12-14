/**
 * Created by Bhargav Butani on 02.09.2021.
 */
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Retrieve and return all Users from the database.
module.exports = exports = {
  // route handler
  handler: async (req, res) => {
    const { user } = req;
    const id = req.params.id;
    // if (user.type !== enums.USER_TYPE.SUPERADMIN) {
    //   const data4createResponseObject = {
    //     req: req,
    //     result: -1,
    //     message: messages.NOT_AUTHORIZED,
    //     payload: {},
    //     logPayload: false,
    //   };
    //   return res
    //     .status(enums.HTTP_CODES.UNAUTHORIZED)
    //     .json(utils.createResponseObject(data4createResponseObject));
    // }
    try {
      req.query.page = req.query.page ? req.query.page : 1;
      let page = parseInt(req.query.page);
      req.query.limit = req.query.limit ? req.query.limit : 10;
      let limit = parseInt(req.query.limit);
      let skip = (parseInt(page) - 1) * limit;

      let search = req.query.search
        ? {
            lastPage: { $regex: req.query.search, $options: "i" },
          }
        : {};

      const count = await global.models.GLOBAL.ADMINLOGINLOG.find({
        uid: id,
        type: "logout",
        ...search,
      }).count();
      if (req.query.page) {
        admin = await global.models.GLOBAL.ADMINLOGINLOG.find({
          uid: id,
          type: "logout",
          ...search,
        })
          .sort({ registrationDate: -1 })
          .skip(skip)
          .limit(limit)
          .populate({ path: "uid", model: "admin" });
      } else {
        admin = await global.models.GLOBAL.ADMINLOGINLOG.find({
          uid: id,
          type: "logout",
          ...search,
        })
          .sort({
            registrationDate: -1,
          })
          .populate({ path: "uid", model: "admin" });
      }

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { admin, count: count },
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
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
