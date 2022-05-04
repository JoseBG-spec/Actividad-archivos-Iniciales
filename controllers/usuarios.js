let Usuario = require("../models/usuario");
let Bicicleta = require("../models/bicicleta");
let bcrypt = require("bcrypt");

module.exports = {
  list: function (req, res, next) {
    Usuario.find({}, (err, usuarios) => {
      res.render("usuarios/index", { usuarios: usuarios });
    });
  },
  update_get: function (req, res, next) {
    Usuario.findById(req.params.id, function (err, usuario) {
      res.render("usuarios/update", { errors: {}, usuario: usuario });
    });
  },
  update: function (req, res, next) {
    let update_values = { nombre: req.body.nombre };
    Usuario.findByIdAndUpdate(req.params.id, update_values, function (err, usurio) {
        if (err) {
          console.log(err);
          res.render("usuario/update", {
            errors: err.errors,
            usuario: new Usuario({
              nombre: req.body.nombre,
              email: req.body.email,
            }),
          });
        } else {
          res.redirect("/usuarios");
          return;
        }
      }
    );
  },
  create_get: function (req, res, next) {
    res.render("usuarios/create", { errors: {}, usuario: new Usuario() });
  },
  create: function (req, res, next) {
    if (req.body.password != req.body.confirm_password) {
      res.render("usuarios/create", {
        errors: {
          confirm_password: { message: "No coinciden los passwords " },
        },
        usuario: new Usuario({
          nombre: req.body.nombre,
          email: req.body.email,
        }),
      });
      return;
    }
    Usuario.create(
      {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
      },
      function (err, nuevoUsuario) {
        if (err) {
          res.render("usuarios/create", {
            errors: {
              email: { message: "Ya existe un usuario con esa contraseña" },
            },
            usuario: new Usuario({
              nombre: req.body.nombre,
              email: req.body.email,
            }),
          });
        } else {
          nuevoUsuario.enviar_mail_bienvenida();
          res.redirect("/usuarios");
        }
      }
    );
  },
  delete: function (req, res, next) {
    Usuario.findByIdAndDelete(req.body.id, function (err) {
      if (err) next(err);
      else res.redirect("/usuarios");
    });
  },
  reserva_get: function (req, res, next) {
    Usuario.findById(req.params.id, function (err, usuario) {
      res.render("usuarios/reserva", { errors: {}, usuario: usuario });
    });
  },
  reserva: async function (req, res, next) {
    let bicicleta = await Bicicleta.findOne({ code: req.body.bicicleta });
    let usuario = await Usuario.findOne({ nombre: req.body.usuario });
    usuario.reservar(bicicleta._id, req.body.desde,req.body.final,
      function (err, reserva) {
        if (err) next(err);
        else res.redirect("/usuarios");
      }
    );
  },
  login_get: function (req, res, next) {
    res.render("usuarios/login", { errors: {}, usuario: new Usuario() });
  },
  login: async function (req, res, next) {
    let usuario = await Usuario.findOne({ email: req.body.email });
    if (usuario) {
      if (!usuario.verificado) {
        res.json({ error: "No esta verificado" });
      }
      let passwordValidation = await bcrypt.compare(
        req.body.password,
        usuario.password
      );
      if (!passwordValidation) {
        res.json({ error: "Contraseña incorrecta" });
      } else {
        res.redirect("/");
      }
    }
  },
};
