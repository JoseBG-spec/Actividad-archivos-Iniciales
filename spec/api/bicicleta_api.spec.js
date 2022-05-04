const mongoose = require("mongoose");
const Bicicleta = require("../../models/bicicleta");
const request = require("request");
var expect = require("expect.js");

let base_url = "http://localhost:3000/api/bicicletas/";

describe("Bicicletas API", () => {
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
  describe("GET BICICLETAS /", () => {
    it("Obtiene Bicicletas de la API", (done) => {
      request.get(base_url, function (error, response, body) {
        console.log(body)
        let res = JSON.parse(body);
        expect(response.statusCode).to.be(200);
        let bicis_num = Object.keys(res).length;
        expect(bicis_num).to.be(1);
        done();
      });
    });
  });
  describe("POST BICICLETA /create", () => {
    it("Crea una Bicicleta", (done) => {
      let headers = { "content-type": "application/json" };
      let BiciTest ='{"code" : 2, "color": "blue", "modelo": "bmx3", "lat": 2.22, "lon": -9.32}';
      request.post(
        {
          headers: headers,
          url: base_url + "create",
          body: BiciTest,
        },
        (error, response, body) => {
          expect(response.statusCode).to.be(200);
          let bici = JSON.parse(body).bicicleta;
          expect(bici.color).to.be("blue");
          expect(bici.modelo).to.be("bmx3");
          expect(bici.ubicacion[1]).to.be(-9.32);
          expect(bici.ubicacion[0]).to.be(2.22);
          done();
        }
      );
    });
  });
});
