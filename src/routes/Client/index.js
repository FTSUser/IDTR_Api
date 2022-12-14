const express = require("express");
const router = express.Router();
const clientApi = require("../../api/Clients");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllClient", clientApi.getAllClient.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);
router.get("/getClient/:id", clientApi.getAllClient.handler);

// Post Methods
router.post(
  "/addClient",
  validate("body", clientApi.addClient.validation),
  clientApi.addClient.handler
);

// // Put Methods
router.put("/updateClient/:id", clientApi.updateClient.handler);

// // Delete Methods
router.delete("/deleteClient/:id", clientApi.deleteClient.handler);

module.exports = exports = router;
