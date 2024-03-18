const express = require("express");
const controller = require("../controller/userController");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const GetCache = require('../middleware/cache');

if (process.env.NODE_ENV === 'test') {
    router.get("/", controller.getUsers);
    router.get("/:email", controller.getOne);
}
router.get("/", GetCache, controller.getUsers);
router.get("/:email", GetCache, controller.getOne);
router.post("/update/:id", authenticateUser, controller.updateOne);
router.post("/delete/:id", authenticateUser, controller.deleteOne);

module.exports = router;
