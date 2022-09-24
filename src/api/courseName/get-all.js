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
      // req.query.page = req.query.page ? req.query.page : 1;
      // let page = parseInt(req.query.page);
      // req.query.limit = req.query.limit ? req.query.limit : 10;
      // let limit = parseInt(req.query.limit);
      // let skip = (parseInt(req.query.page) - 1) * limit;

      // let id = req.params.id;
      let sd=req.query.sd;
      let ed=req.query.ed;
      let dateFilter={};
      if(sd){
        dateFilter={$and:[{createdAt:{$gte:new Date(sd)}},{createdAt:{$lte:new Date(ed)}}]};
      }
      let search = req.query.search
        ? {
            courseName: { $regex: req.query.search, $options: "i" },
            isDelete: false,
            isActive: true,
            ...dateFilter,
          }
        : { isDelete: false, isActive: true, ...dateFilter };
      
      if (req.query.language) {
        search = {
          ...search,
          language: req.query.language,
        };
      }
      
      // const findCoursetype = await global.models.GLOBAL.COURSETYPE.find(search)
      const count = await global.models.GLOBAL.COURSENAME.find(search).count();
      const Questions = await global.models.GLOBAL.COURSENAME.find(search)
        .sort({ createdAt: -1 })
        .populate({
          path: "ctid",
          model: "courseType",
        })
        .populate({
          path: "vcid",
          model: "vehicleCategory",
        })
        .populate({
          path: "ccid",
          model: "courseCategory",
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
