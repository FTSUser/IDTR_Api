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
    type: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    language: Joi.string().required(), 
    date: Joi.date().required(),
    isActive: Joi.boolean(),
  }),

  handler: async (req, res) => {
    const { name, type, image, description, date, language, isActive } = req.body;
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
    if (!name || !type || !image || !description || !date || !language) {
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
      const checkMenu = await global.models.GLOBAL.ANNOUNCEMENT.find({
        name: name,
        language: language
      });
      if (checkMenu.length > 0) {
        const data4createResponseObject = {
          req: req,
          result: -400,
          message: messages.EXISTS_MENU,
          payload: {},
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
        return;
      }
      // let AmenintiesCreate = {
      //   name: name,
      //   type: type,
      //   image: image,
      //   description: description,
      //   date: date,
      //   isActive: isActive,
      // };
      // const newAmeninties = await global.models.GLOBAL.ANNOUNCEMENT(
      //   AmenintiesCreate
      // );
      // newAmeninties.save();

      let AmenintiesCreate = {
        name: name,
        type: type,
        image: image,
        description: description,
        date: date,
        language: language,
        isActive: isActive,
        part: "Announcement",
        purpose: "Add",
      };

      const newAmeninties = await global.models.GLOBAL.REQUEST(
        AmenintiesCreate
      );
      newAmeninties.save();
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.REQUEST_ADDED,
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
