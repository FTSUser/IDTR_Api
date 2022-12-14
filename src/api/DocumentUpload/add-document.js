const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    photo: Joi.array().required(),
    drivingLicense: Joi.string().required(),
    idProof: Joi.object().required(),
    medicalCertificate: Joi.array().required(),
    bloodGroup: Joi.string().required(),
  }),

  handler: async (req, res) => {
    const { photo, drivingLicense, idProof, medicalCertificate, bloodGroup } =
      req.body;
    const { user } = req;

    if (
      !photo ||
      !drivingLicense ||
      !idProof ||
      !medicalCertificate ||
      !bloodGroup
    ) {
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
      const checkMenu = await global.models.GLOBAL.DOCUMENT.find({});
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
      let AmenintiesCreate = {
        photo: photo,
        drivingLicense: drivingLicense,
        idProof: idProof,
        medicalCertificate: medicalCertificate,
        bloodGroup: bloodGroup,
      };
      const newAmeninties = await global.models.GLOBAL.DOCUMENT(
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
