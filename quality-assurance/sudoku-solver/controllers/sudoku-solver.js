class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    if (!/^[1-9\.]+$/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (i === column) continue;
      if (puzzleString[row][i] === value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (i === row) continue;
      if (puzzleString[i][column] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    for (let i = regionRow; i < regionRow + 3; i++) {
      for (let j = regionCol; j < regionCol + 3; j++) {
        if (i === row && j === column) continue;
        if (puzzleString[i][j] === value) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation.error) return validation;
    const puzzle = this.stringToMatriz(puzzleString);
    if (this.solveSudoku(puzzle)) {
      return this.matrizToString(puzzle);
    }
    return { error: "Puzzle cannot be solved" };
  }

  solveSudoku(puzzle) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] === ".") {
          for (let k = 1; k <= 9; k++) {
            const value = k.toString();
            if (this.isSafe(puzzle, i, j, value)) {
              puzzle[i][j] = value;
              if (this.solveSudoku(puzzle)) {
                return true;
              }
              puzzle[i][j] = ".";
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isSafe(puzzle, row, col, value) {
    return (
      this.checkRowPlacement(puzzle, row, col, value) &&
      this.checkColPlacement(puzzle, row, col, value) &&
      this.checkRegionPlacement(puzzle, row, col, value)
    );
  }

  matrizToString(matriz) {
    let puzzleString = "";
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        puzzleString += matriz[i][j];
      }
    }
    return puzzleString;
  }

  stringToMatriz(puzzleString) {
    let matriz = [];
    for (let i = 0; i < 9; i++) {
      let row = [];
      for (let j = 0; j < 9; j++) {
        row.push(puzzleString[i * 9 + j]);
      }
      matriz.push(row);
    }
    return matriz;
  }
}

module.exports = SudokuSolver;
