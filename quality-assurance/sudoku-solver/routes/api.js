"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value)
      return res.json({ error: "Required field(s) missing" });
    if (!/^[A-Ia-i][1-9]$/.test(coordinate))
      return res.json({ error: "Invalid coordinate" });
    if (!/^[1-9]$/.test(value)) return res.json({ error: "Invalid value" });
    const validation = solver.validate(puzzle);
    if (validation.error) return res.json(validation);
    const puzzleMatriz = solver.stringToMatriz(puzzle);
    const row = coordinate.toUpperCase().charCodeAt(0) - 65;
    const col = parseInt(coordinate[1]) - 1;
    const conflict = [];
    if (!solver.checkRowPlacement(puzzleMatriz, row, col, value))
      conflict.push("row");
    if (!solver.checkColPlacement(puzzleMatriz, row, col, value))
      conflict.push("column");
    if (!solver.checkRegionPlacement(puzzleMatriz, row, col, value))
      conflict.push("region");
    if (conflict.length === 0) return res.json({ valid: true });
    return res.json({ valid: false, conflict });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) return res.json({ error: "Required field missing" });
    const solution = solver.solve(puzzle);
    if (solution.error) return res.json(solution);
    return res.json({ solution });
  });
};
