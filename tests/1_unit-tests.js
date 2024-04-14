const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();
const puzzleString =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

suite("Unit Tests", () => {
    test("Solves valid puzzle string", function () {
        assert.strictEqual(
            solver.validate(puzzleString),
            "is valid",
            "Handles valid puzzle string"
        );
    });
    test("Handles puzzle string with invalid characters", function () {
        assert.deepEqual(
            solver.validate(
                "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
            ),
            { error: "Invalid characters in puzzle" },
            "Handles invalid characters"
        );
    });
    test("Handles puzzle string with invalid length", function () {
        assert.deepEqual(
            solver.validate("invalid_length"),
            { error: "Expected puzzle to be 81 characters long" },
            "Handles invalid length"
        );
    });
    test("Handles valid row placement", function () {
        assert.deepEqual(solver.check(puzzleString, 3, 2, 2), {
            valid: false,
            conflict: ["column", "region"],
        }),
            "Handles valid row placement";
    });
    test("Handles invalid row placement", function () {
        assert.deepEqual(solver.check(puzzleString, 0, 6, 5), {
            valid: false,
            conflict: ["row"],
        }),
            "Handles invalid row placement";
    });
    test("Handles valid column placement", function () {
        assert.deepEqual(solver.check(puzzleString, 4, 3, 6), {
            valid: false,
            conflict: ["region", "row"],
        }),
            "Handles valid column placement";
    });
    test("Handles invalid column placement", function () {
        assert.deepEqual(solver.check(puzzleString, 4, 0, 5), {
            valid: false,
            conflict: ["column"],
        }),
            "Handles invalid column placement";
    });
    test("Handles valid region placement", function () {
        assert.deepEqual(solver.check(puzzleString, 1, 7, 8), {
            valid: false,
            conflict: ["row", "column"],
        }),
            "Handles valid region placement";
    });
    test("Handles invalid region placement", function () {
        assert.deepEqual(solver.check(puzzleString, 6, 4, 3), {
            valid: false,
            conflict: ["region"],
        }),
            "Handles invalid region placement";
    });
    test("Solves valid string", function () {
        assert.strictEqual(
            solver.solve(puzzleString),
            "769235418851496372432178956174569283395842761628713549283657194516924837947381625",
            "Solves valid string"
        );
    });
    test("Fails to solve invalid string", function () {
        assert.strictEqual(
            solver.solve(
                "111112.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
            ),
            false,
            "Fails to solve invalid string"
        );
    });
    test("Solves puzzle", function () {
        assert.strictEqual(
            solver.solve(
                "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
            ),
            "135762984946381257728459613694517832812936745357824196473298561581673429269145378",
            "Can solve"
        );
    });
});
