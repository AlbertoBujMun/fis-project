var chai = require("chai");
var expect = chai.expect;

describe("Contacts API", () => {
  it("hello test", done => {
    var x = 3;
    var y = 5;

    var res = x + y;

    expect(res).to.equal(8);
    done();
  });
});
