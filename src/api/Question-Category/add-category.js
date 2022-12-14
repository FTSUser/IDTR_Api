const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    name: Joi.string().required(),
    vcid: Joi.string(),
    vscid: Joi.string(),
    isActive: Joi.boolean(),
  }),

  handler: async (req, res) => {
    const { name, vcid, vscid, isActive } = req.body;
    const { user } = req;
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
    if (!name) {
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
    let findVcid = await global.models.GLOBAL.VEHICLECATEGORY.find({
      _id: vcid,
    });
    if (findVcid.length == 0) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.ENTER_VCID,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    try {
      //   const checkMenu = await global.models.GLOBAL.MENU.find({ name: name });
      //   if (checkMenu.length > 0) {
      //     const data4createResponseObject = {
      //       req: req,
      //       result: -400,
      //       message: messages.EXISTS_MENU,
      //       payload: {},
      //       logPayload: false,
      //     };
      //     res
      //       .status(enums.HTTP_CODES.OK)
      //       .json(utils.createResponseObject(data4createResponseObject));
      //     return;
      //   }
      let AmenintiesCreate = {
        name: name,
        vcid: vcid,
        vscid: vscid,
        isActive: isActive,
      };
      const newAmeninties = await global.models.GLOBAL.QUESTIONCATEGORY(
        AmenintiesCreate
      );
      newAmeninties.save();
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.ITEM_INSERTED,
        payload: { newAmeninties },
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
