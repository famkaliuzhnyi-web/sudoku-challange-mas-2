// Sudoku game logic utilities

/**
 * Generate a valid Sudoku puzzle
 * @param {number} difficulty - Difficulty level (0.3 = easy, 0.5 = medium, 0.7 = hard)
 * @returns {Array} 9x9 array representing the Sudoku board
 */
export function generateSudoku(difficulty = 0.5) {
  // Create a complete valid Sudoku board
  const board = createEmptyBoard();
  fillBoard(board);
  
  // Remove cells based on difficulty
  const cellsToRemove = Math.floor(81 * difficulty);
  removeCells(board, cellsToRemove);
  
  return board;
}

/**
 * Create an empty 9x9 Sudoku board
 * @returns {Array} Empty 9x9 array
 */
function createEmptyBoard() {
  return Array(9).fill(null).map(() => Array(9).fill(0));
}

/**
 * Fill the board with a valid Sudoku solution
 * @param {Array} board - 9x9 board array
 * @returns {boolean} True if successfully filled
 */
function fillBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (let num of numbers) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            
            if (fillBoard(board)) {
              return true;
            }
            
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Remove cells from the board to create a puzzle
 * @param {Array} board - Completed Sudoku board
 * @param {number} cellsToRemove - Number of cells to remove
 */
function removeCells(board, cellsToRemove) {
  let removed = 0;
  
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }
}

/**
 * Check if a move is valid according to Sudoku rules
 * @param {Array} board - Current board state
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {number} num - Number to place
 * @returns {boolean} True if move is valid
 */
export function isValidMove(board, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  
  return true;
}

/**
 * Check if the puzzle is complete and valid
 * @param {Array} board - Current board state
 * @returns {boolean} True if puzzle is solved
 */
export function isSolved(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num === 0) return false;
      
      // Temporarily remove the number to check validity
      board[row][col] = 0;
      if (!isValidMove(board, row, col, num)) {
        board[row][col] = num;
        return false;
      }
      board[row][col] = num;
    }
  }
  return true;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Create a deep copy of the board
 * @param {Array} board - Board to copy
 * @returns {Array} Deep copy of the board
 */
export function copyBoard(board) {
  return board.map(row => [...row]);
}

/**
 * Get difficulty settings
 * @returns {Object} Difficulty configurations
 */
export function getDifficultySettings() {
  return {
    easy: { difficulty: 0.3, name: 'Easy' },
    medium: { difficulty: 0.5, name: 'Medium' },
    hard: { difficulty: 0.7, name: 'Hard' }
  };
}