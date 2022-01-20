const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
    // route validation
    validation: Joi.object({
        name:Joi.string().required(),
        email:Joi.string(),
        phone:Joi.number().required(),
        feedbackCategory:Joi.string().required(),
        rating:Joi.number().required(),
        description:Joi.string()
    }),

    handler: async (req, res) => {
        const { name,email,phone,feedbackCategory,rating,description} = req.body;
        const { user } = req;
        // if (user.type !== enums.USER_TYPE.SUPERADMIN) {
        //     const data4createResponseObject = {
        //         req: req,
        //         result: -1,
        //         message: messages.NOT_AUTHORIZED,
        //         payload: {},
        //         logPayload: false
        //     };
        //     return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
        // }
        if (!name || !phone || !feedbackCategory || !rating) {
            const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.FILL_DETAILS,
                payload: {},
                logPayload: false
            };
            return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
        }

        try {

            const checkMenu = await global.models.GLOBAL.FEEDBACK.find({ phone:phone });
            if (checkMenu.length > 0) {
                const data4createResponseObject = {
                    req: req,
                    result: -400,
                    message: messages.EXISTS_MENU,
                    payload: {},
                    logPayload: false
                };
                res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
                return;
            }
            let AmenintiesCreate = {
                name:name,
                email:email,
                phone:phone,
                feedbackCategory:feedbackCategory,
                rating:rating,
                description:description
            };
            const newAmeninties = await global.models.GLOBAL.FEEDBACK(AmenintiesCreate);
            newAmeninties.save();
            const data4createResponseObject = {
                req: req,
                result: 0,
                message: messages.ITEM_INSERTED,
                payload: { newAmeninties },
                logPayload: false
            };
            res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
        } catch (error) {
            logger.error(`${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`);
            const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.GENERAL,
                payload: {},
                logPayload: false
            };
            res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
        }
    }
};