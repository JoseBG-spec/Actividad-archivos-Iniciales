let express = require("express");
let router = express.Router();
let reservasController = require("../controllers/reservas.js");

router.get("/", reservasController.list);

module.exports = router;
