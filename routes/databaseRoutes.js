const express = require("express");
const {
  createDatabase,
  setMasterPassword,
  changeMasterPassword,
  getMasterPassword,
  getPort,
} = require("../controllers/databaseController");

const router = express.Router();

router.post("/create-database", createDatabase);
router.post("/set-master-password", setMasterPassword);
router.post("/change-master-password", changeMasterPassword);
router.get("/get-master-password", getMasterPassword);
router.get("/get-port", getPort);
console.log("routes", router);

module.exports = router;
