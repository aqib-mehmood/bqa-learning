var DemoClass = require("../src/DemoClass.js");
var chai = require("chai");
var expect = chai.expect;

var obj = new DemoClass();

describe("Test Suite", () => {
    it("Test Case 01 - Checking add function", function(){
        expect(obj.add(5,4)).to.be.equal(09);
    });
    it("Test Case 02 - Testing add function", function(){
        expect(obj.add(5,4)).to.be.equal(10);
    });
});
