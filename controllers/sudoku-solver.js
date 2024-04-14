class SudokuSolver {
    validate(puzzleString) {
        const regex = /^[0-9.]+$/g;

        if (puzzleString.length !== 81) {
            return {
                error: "Expected puzzle to be 81 characters long",
            };
        } else if (!regex.test(puzzleString)) {
            return { error: "Invalid characters in puzzle" };
        }

        return "is valid";
    }

    check(puzzleString, row, col, value) {
        const board = stringToMatrix(puzzleString);
        const currentCell = board[row][col];
        let conflicts = [];

        for (let i = 0; i < 9; i++) {
            const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const n = 3 * Math.floor(col / 3) + (i % 3);

            if (
                board[row][i] == value &&
                !conflicts.includes("row") &&
                board[row][i] !== currentCell
            ) {
                conflicts.push("row");
            }
            if (
                board[i][col] == value &&
                !conflicts.includes("column") &&
                board[i][col] !== currentCell
            ) {
                conflicts.push("column");
            }
            if (
                board[m][n] == value &&
                !conflicts.includes("region") &&
                board[m][n] !== currentCell
            ) {
                conflicts.push("region");
            }
        }

        if (conflicts.length > 0) {
            return { valid: false, conflict: conflicts };
        } else {
            return { valid: true };
        }
    }

    solve(puzzleString) {
        return solvePuzzle(stringToMatrix(puzzleString));
    }
}

const stringToMatrix = (puzzleString) => {
    let board = [];
    let row = [];

    for (let i = 0; i < puzzleString.length; i++) {
        row.push(Number(puzzleString[i]) || 0);

        if (i % 9 === 8) {
            board.push(row);
            row = [];
        }
    }

    return board;
};

const isValid = (board, row, col, num) => {
    for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + (i % 3);

        if (
            board[row][i] === num ||
            board[i][col] === num ||
            board[m][n] === num
        ) {
            return false;
        }
    }
    return true;
};

const solvePuzzle = (board) => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solvePuzzle(board)) {
                            return board.flat().join("");
                        } else {
                            board[row][col] = 0;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
};

module.exports = SudokuSolver;
