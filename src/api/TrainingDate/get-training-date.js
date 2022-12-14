const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");
const moment = require("moment");
const { ObjectId } = require("mongodb");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    try {
      req.query.page = req.query.page ? req.query.page : 1;
      let page = parseInt(req.query.page);
      req.query.limit = req.query.limit ? req.query.limit : 10;
      let limit = parseInt(req.query.limit);
      let skip = (parseInt(req.query.page) - 1) * limit;

      // let ids=req.query.date;
      // let id=req.query.cnid;
      // let starttime = req.query.startTime;
      // let endtime = req.query.endTime;
      let { date, cnid, startTime, endTime } = req.query;
      let startDate = moment(date).add(1, "days").format("YYYY-MM-DD");
      let endDate = moment(date).add(5, "days").format("YYYY-MM-DD");

      // startDate = new Date(startDate.toString());
      // endDate = new Date(endDate.toString())
      // { $gte: startDate.toString(), $lte: endDate.toString() }
      let date1 = new Date(date);
      let date2 = new Date(date);
      date1.setHours(0);
      date1.setMinutes(0);
      date1.setSeconds(0);
      date1.setMilliseconds(0);
      date2.setHours(23);
      date2.setMinutes(59);
      date2.setSeconds(59);
      date2.setMilliseconds(59);
      let filter0 = date
        ? {
            $and: [{ date: { $gte: date1 } }, { date: { $lte: date2 } }],
            cnid: ObjectId(cnid),
            seat: { $ne: 0 },
          }
        : {};
      let filter1 =
        startTime != null
          ? {
              $and: [
                { date: date },
                { cnid: cnid },
                { startTime: startTime },
                { endTime: endTime },
              ],
            }
          : {};
      let getData = { $and: [filter0, filter1] };
      // let search = req.query.search ? { name: { $regex: req.query.search, $options: 'i' },date:{$in:ids},cnid:{$in:id},startTime:{$in:starttime},endTime:{$in:endtime} } : { date:{$in:ids},cnid:{$in:id},startTime:{$in:starttime},endTime:{$in:endtime} };
      // const findCourse = await global.models.GLOBAL.TRAININGDATE.
      // let search = req.query.search ? {name:{$regex:req.query.search,$options:'i'}, filter0:filter0} :{filter0:filter0}
      const count = await global.models.GLOBAL.TRAININGDATE.find(
        getData
      ).count();
      const subMenus = await global.models.GLOBAL.TRAININGDATE.find(getData)
        .skip(skip)
        .limit(limit);
      // console.log();
      if (subMenus.length == 0) {
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
        payload: { subMenu: subMenus, count: count },
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
