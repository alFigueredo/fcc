const chai = require("chai");
const assert = chai.assert;

const SudokuSolver = require("../controllers/sudoku-solver");
const solver = new SudokuSolver();
const puzzlesAndSolutions =
  require("../controllers/puzzle-strings").puzzlesAndSolutions;

suite("Unit Tests", () => {
  suite("Function validate(puzzleString)", () => {
    test("Logic handles a valid puzzle string of 81 characters", (done) => {
      const puzzleString = puzzlesAndSolutions[0][0];
      assert.strictEqual(solver.validate(puzzleString), true);
      done();
    });
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
      const puzzleString = puzzlesAndSolutions[0][0].replace("1", "a");
      assert.strictEqual(
        solver.validate(puzzleString).error,
        "Invalid characters in puzzle"
      );
      done();
    });
    test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
      const puzzleString = puzzlesAndSolutions[0][0].slice(0, -1);
      assert.strictEqual(
        solver.validate(puzzleString).error,
        "Expected puzzle to be 81 characters long"
      );
      done();
    });
  });

  suite("Function checkRowPlacement(puzzleString, row, column, value)", () => {
    const puzzleString = solver.stringToMatriz(puzzlesAndSolutions[0][0]);
    test("Logic handles a valid row placement", (done) => {
      assert.strictEqual(
        solver.checkRowPlacement(puzzleString, 0, 1, "7"),
        true
      );
      done();
    });
    test("Logic handles an invalid row placement", (done) => {
      assert.strictEqual(
        solver.checkRowPlacement(puzzleString, 0, 1, "1"),
        false
      );
      done();
    });
  });
  suite("Function checkColPlacement(puzzleString, row, column, value)", () => {
    const puzzleString = solver.stringToMatriz(puzzlesAndSolutions[0][0]);
    test("Logic handles a valid column placement", (done) => {
      assert.strictEqual(
        solver.checkColPlacement(puzzleString, 0, 1, "5"),
        true
      );
      done();
    });
    test("Logic handles an invalid column placement", (done) => {
      assert.strictEqual(
        solver.checkColPlacement(puzzleString, 0, 1, "7"),
        false
      );
      done();
    });
  });
  suite(
    "Function checkRegionPlacement(puzzleString, row, column, value)",
    () => {
      const puzzleString = solver.stringToMatriz(puzzlesAndSolutions[0][0]);
      test("Logic handles a valid region (3x3 grid) placement", (done) => {
        assert.strictEqual(
          solver.checkRegionPlacement(puzzleString, 0, 1, "3"),
          true
        );
        done();
      });
      test("Logic handles an invalid region (3x3 grid) placement", (done) => {
        assert.strictEqual(
          solver.checkRegionPlacement(puzzleString, 0, 1, "5"),
          false
        );
        done();
      });
    }
  );
  suite("Function solve(puzzleString)", () => {
    const puzzleString = puzzlesAndSolutions[0][0];
    test("Valid puzzle strings pass the solver", (done) => {
      assert.strictEqual(solver.solve(puzzleString), puzzlesAndSolutions[0][1]);
      done();
    });
    test("Invalid puzzle strings fail the solver", (done) => {
      const invalidPuzzleString = puzzleString.replace("1", "a");
      assert.strictEqual(
        solver.solve(invalidPuzzleString).error,
        "Invalid characters in puzzle"
      );
      done();
    });
    test("Solver returns the expected solution for an incomplete puzzle", (done) => {
      assert.strictEqual(
        solver.solve(puzzlesAndSolutions[0][0]),
        puzzlesAndSolutions[0][1]
      );
      assert.strictEqual(
        solver.solve(puzzlesAndSolutions[1][0]),
        puzzlesAndSolutions[1][1]
      );
      assert.strictEqual(
        solver.solve(puzzlesAndSolutions[2][0]),
        puzzlesAndSolutions[2][1]
      );
      assert.strictEqual(
        solver.solve(puzzlesAndSolutions[3][0]),
        puzzlesAndSolutions[3][1]
      );
      assert.strictEqual(
        solver.solve(puzzlesAndSolutions[4][0]),
        puzzlesAndSolutions[4][1]
      );
      done();
    });
  });
});
