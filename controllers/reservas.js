let Reserva = require("../models/reserva");
module.exports = {
  list: function (req, res, next) {
    Reserva.find({}, (err, reservas) => {
      res.render("reservas/index", { reservas: reservas });
    });
  },
};
