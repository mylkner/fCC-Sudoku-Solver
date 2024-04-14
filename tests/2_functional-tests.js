const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
    this.timeout(0);
    const puzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

    test("POST /api/solve with valid string", function (done) {
        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: puzzle })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    solution:
                        "135762984946381257728459613694517832812936745357824196473298561581673429269145378",
                });
                done();
            });
    });
    test("POST /api/solve with missing string", function (done) {
        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: "" })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "Required field missing" });
                done();
            });
    });
    test("POST /api/solve with invalid character string", function (done) {
        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: "a" + puzzle.slice(1) })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "Invalid characters in puzzle",
                });
                done();
            });
    });
    test("POST /api/solve with incorrect length string", function (done) {
        chai.request(server)
            .post("/api/solve")
            .send({ puzzle: puzzle.slice(1, 76) })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "Expected puzzle to be 81 characters long",
                });
                done();
            });
    });
    test("POST /api/solve with unsolvable string", function (done) {
        chai.request(server)
            .post("/api/solve")
            .send({
                puzzle: "111112.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "Puzzle cannot be solved",
                });
                done();
            });
    });
    test("POST /api/check with all fields", function (done) {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: puzzle,
                coordinate: "a1",
                value: "1",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    valid: true,
                });
                done();
            });
    });
    test("POST /api/check with single conflict", function (done) {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: puzzle,
                coordinate: "a2",
                value: "8",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.deepEqual(res.body.conflict, ["row"]);
                done();
            });
    });
    test("POST /api/check with multiple conflicts", function (done) {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: puzzle,
                coordinate: "a5",
                value: "4",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.deepEqual(res.body.conflict, ["row", "column"]);
                done();
            });
    });
    test("POST /api/check with all conflicts", function (done) {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: puzzle,
                coordinate: "a1",
                value: "2",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.deepEqual(res.body.conflict, [
                    "row",
                    "region",
                    "column",
                ]);
                done();
            });
    });
    test("POST /api/check with missing fields", function (done) {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: puzzle,
                coordinate: "",
                value: "2",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "Required field(s) missing",
                });
                done();
            });
    });
    test("POST /api/check with invalid characters", function (done) {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: "A" + puzzle.slice(1),
                coordinate: "a1",
                value: "2",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "Invalid characters in puzzle",
                });
                done();
            });
    });
    test("POST /api/check with incorrect length", function (done) {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: puzzle.slice(1),
                coordinate: "a1",
                value: "2",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "Expected puzzle to be 81 characters long",
                });
                done();
            });
    });
    test("POST /api/check with invalid coordinate", function (done) {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: puzzle,
                coordinate: "j0",
                value: "2",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "Invalid coordinate",
                });
                done();
            });
    });
    test("POST /api/check with invalid value", function (done) {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle: puzzle,
                coordinate: "a1",
                value: "10",
            })
            .end(function (req, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {
                    error: "Invalid value",
                });
                done();
            });
    });
});
