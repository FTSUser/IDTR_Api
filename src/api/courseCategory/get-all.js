const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    try {
      let search = req.query.search
        ? {
            courseCategory: { $regex: req.query.search, $options: "i" },
            isDelete: false,
          }
        : { isDelete: false };

      // const findCoursetype = await global.models.GLOBAL.COURSETYPE.find(search)
      const count = await global.models.GLOBAL.COURSECATEGORY.find(
        search
      ).count();
      const Questions = await global.models.GLOBAL.COURSECATEGORY.find(search)

        .sort({ createdAt: -1 })
        .populate({
          path: "ctid",
          model: "courseType",
        })
        .populate({
          path: "vcid",
          model: "vehicleCategory",
        });
      if (Questions.length == 0) {
        const data4createResponseObject = {
          req: req,
          result: -400,
          message: messages.NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
        return;
      }
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { Question: Questions, count: count },
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
