const mongoose = require("mongoose");
const { isReadStream } = require("request/lib/helpers");
const Bicicleta = require("../../models/bicicleta");
var expect = require("expect.js");

describe("Bicicleta Test", function () {
  beforeEach(function (done) {
    var mongoDB = "mongodb://localhost:27017/test";
    mongoose.connect(mongoDB, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error"));
    db.once("open", function () {
      console.log('Connected to the test database')
      done();
    });
  });

  afterEach(function (done) {
    Bicicleta.deleteMany({}, function (err, success) {
      if (err) console.log(err);
      const db = mongoose.connection;
      db.close();
      done();
    });
  });

  describe("Crea una bicicleta", () => {
    it("Crea una bicicleta", () => {
      let bici = Bicicleta.createInstance(
        2,
        "azul",
        "bmx4",
        [8.00, 7.67]
      );
      expect(bici.code).to.be(2);
      expect(bici.color).to.be("azul");
      expect(bici.modelo).to.be("bmx4");
      expect(bici.ubicacion[0]).to.equal(8.00);
      expect(bici.ubicacion[1]).to.equal(7.67);
    });
  });

  describe("Obtener bici", () => {
    it("Vacia", (done) => {
      Bicicleta.allBicis(function (err, bicis) {
        expect(bicis.length).to.be(0);
        done();
      });
    });
  });
  describe("Añadir Bici", () => {
    it("Agregar bici", (done) => {
      let bici = new Bicicleta({ code: 4, color: "azul", modelo: "bmx4" });
      Bicicleta.add(bici, function (err, newBici) {
        if (err) console.log(err);
        Bicicleta.allBicis(function (err, bicis) {
          expect(bicis.length).to.equal(1);
          expect(bicis[0].code).to.equal(bici.code);

          done();
        });
      });
    });
  });
  describe("Encontrar bici por codigo", () => {
    it("Debe regresar una bici con codigo 4", (done) => {
      Bicicleta.allBicis(function (err, bicis) {
        expect(bicis.length).to.be(0);
        let bici = new Bicicleta({ code: 4, color: "azul", modelo: "bmx4" });
        Bicicleta.add(bici, function (err, newBike) {
          if (err) console.log(err);
          let bici2 = new Bicicleta({
            code: 2,
            color: "morada",
            modelo: "spinning",
          });
          Bicicleta.add(bici2, function (err, newBike) {
            if (err) console.log(err);
            Bicicleta.findByCode(4, function (err, targetBici) {
              expect(targetBici.code).to.be(bici.code);
              expect(targetBici.color).to.be(bici.color);
              expect(targetBici.modelo).to.be(bici.modelo);

              done();
            });
          });
        });
      });
    });
  });

  describe("Borrar bici por ID", () => {
    it("Debe borrar una bici 4", (done) => {
      Bicicleta.allBicis(function (err, bicis) {
        expect(bicis.length).to.be(0);
        let bici = new Bicicleta({ code: 4, color: "azul", modelo: "spinning" });
        Bicicleta.add(bici, function (err, newBike) {
          if (err) console.log(err);
          Bicicleta.allBicis(function (err, bicis) {
            expect(bicis.length).to.be(1);
            Bicicleta.removeByCode(4, function (err, cb) {
              Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).to.be(0);

                done();
              });
            });
          });
        });
      });
    });
  });
});
