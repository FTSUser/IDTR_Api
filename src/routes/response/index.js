const express = require("express");
const router = express.Router();
const responseApi = require("../../api/Response");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllResponse", responseApi.getAllResponse.handler); // params = categoryId / shopId / deviceId
// router.get("/getoneresponse/:id", responseApi.getOneResponse.handler); // params = categoryId / shopId / deviceId
router.get("/getResponseById/:id", responseApi.getResponseById.handler); // params = categoryId / shopId / deviceId
router.get("/getResponseByUser/:id", responseApi.getResponseByBatch.handler);
router.get(
  "/getRequestResponseByStatus",
  responseApi.getRequestResponseByStatus.handler
);
router.get(
  "/getResponseByUserWithoutPagination/:id",
  responseApi.getResponseByUserWithoutPagination.handler
);
router.get("/getResponseByBatch/:id", responseApi.getResponseBatch.handler);
// Post Methods
router.post(
  "/addResponse",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", responseApi.addResponse.validation),
  responseApi.addResponse.handler
);

//PUT Methods
router.put(
  "/updateResponse/:id",
  // passport.authenticate(["jwt"], { session: false }),
  responseApi.updateResponse.handler
); // params = categoryId / shopId / deviceId
router.put(
  "/editRequestResponseById/:id",
  // passport.authenticate(["jwt"], { session: false }),
  responseApi.editRequestResponseById.handler
);

// params = categoryId / shopId / deviceId

//DELETE Methods
router.delete(
  "/deleteResponse/:id",
  // passport.authenticate(["jwt"], { session: false }),
  responseApi.deleteResponse.handler
); // params = categoryId / shopId / deviceId

module.exports = exports = router;
