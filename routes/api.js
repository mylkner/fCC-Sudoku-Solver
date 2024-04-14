"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
    let solver = new SudokuSolver();

    app.route("/api/check").post((req, res) => {
        try {
            const puzzle = req.body.puzzle;
            const coordinate = req.body.coordinate;
            const value = req.body.value;

            if (!puzzle || !coordinate || !value) {
                return res.json({ error: "Required field(s) missing" });
            }

            const isValid = solver.validate(puzzle);

            if (isValid !== "is valid") {
                return res.json(isValid);
            }

            const coRegex = /^[a-i]{1}[1-9]{1}$/i;
            const numRegex = /^[1-9]{1}$/;

            if (!coRegex.test(coordinate)) {
                return res.json({ error: "Invalid coordinate" });
            } else if (!numRegex.test(value)) {
                return res.json({ error: "Invalid value" });
            }

            const rowToIndex = {
                a: 0,
                b: 1,
                c: 2,
                d: 3,
                e: 4,
                f: 5,
                g: 6,
                h: 7,
                i: 8,
            };
            const row = rowToIndex[coordinate.split("")[0].toLowerCase()];
            const col = coordinate.split("")[1] - 1;
            const checker = solver.check(puzzle, row, col, value);

            return res.json(checker);
        } catch (err) {
            console.log(err.message);
        }
    });

    app.route("/api/solve").post((req, res) => {
        const puzzle = req.body.puzzle;

        if (!puzzle) {
            return res.json({ error: "Required field missing" });
        }

        const isValid = solver.validate(puzzle);

        if (isValid !== "is valid") {
            return res.json(isValid);
        }

        const isSolved = solver.solve(puzzle);

        if (isSolved) {
            return res.json({ solution: isSolved });
        } else {
            return res.json({ error: "Puzzle cannot be solved" });
        }
    });
};
