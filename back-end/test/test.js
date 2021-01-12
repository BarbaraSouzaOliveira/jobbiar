process.env.NODE_ENV = "test";

const sinon = require("sinon");

const FAILED_TESTS = {};

function test(name, path) {
  describe(name, function () {
    require(path);
  });
}


describe("Iniciando Testes", async function () {
  beforeEach(function () {
    if (FAILED_TESTS[this.currentTest.file]) {
      this.skip();
    }
  });

  afterEach(function () {
    if (this.currentTest.state === "failed") {
      FAILED_TESTS[this.currentTest.file] = true;
    }

    sinon.restore();
  });

  describe("Controllers", function () {
    test("Unidade", "./controllers/unidade-test");
  });
});