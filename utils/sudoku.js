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
 * Get the definitive number from a cell (single number or null if multiple/empty)
 * @param {number|Array} cellValue - Cell value (number, array, or 0)
 * @returns {number|null} Single number or null
 */
export function getCellDefinitiveValue(cellValue) {
  if (typeof cellValue === 'number' && cellValue !== 0) {
    return cellValue;
  }
  if (Array.isArray(cellValue) && cellValue.length === 1) {
    return cellValue[0];
  }
  return null;
}

/**
 * Check if a cell is empty (no numbers)
 * @param {number|Array} cellValue - Cell value
 * @returns {boolean} True if cell is empty
 */
export function isCellEmpty(cellValue) {
  return cellValue === 0 || (Array.isArray(cellValue) && cellValue.length === 0);
}

/**
 * Check if a cell has multiple numbers (notes)
 * @param {number|Array} cellValue - Cell value
 * @returns {boolean} True if cell has multiple numbers
 */
export function isCellMultiValue(cellValue) {
  return Array.isArray(cellValue) && cellValue.length > 1;
}

/**
 * Toggle a number in a cell (add if not present, remove if present)
 * @param {number|Array} cellValue - Current cell value
 * @param {number} num - Number to toggle
 * @returns {number|Array} New cell value
 */
export function toggleNumberInCell(cellValue, num) {
  // If cell is empty or has a single definitive number, start with notes array
  if (cellValue === 0 || typeof cellValue === 'number') {
    return [num];
  }
  
  // If cell has notes, toggle the number
  if (Array.isArray(cellValue)) {
    const index = cellValue.indexOf(num);
    if (index === -1) {
      // Add number
      const newArray = [...cellValue, num].sort((a, b) => a - b);
      return newArray;
    } else {
      // Remove number
      const newArray = cellValue.filter(n => n !== num);
      return newArray.length === 0 ? 0 : newArray;
    }
  }
  
  return cellValue;
}

/**
 * Set a definitive number in a cell (replaces any notes)
 * @param {number} num - Number to set
 * @returns {number} The definitive number
 */
export function setDefinitiveNumber(num) {
  return num;
}

/**
 * Get display value for a cell
 * @param {number|Array} cellValue - Cell value
 * @returns {number|Array} Value to display
 */
export function getCellDisplayValue(cellValue) {
  if (cellValue === 0) return 0;
  if (typeof cellValue === 'number') return cellValue;
  if (Array.isArray(cellValue)) return cellValue;
  return 0;
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
    if (c !== col) {
      const cellValue = getCellDefinitiveValue(board[row][c]);
      if (cellValue === num) return false;
    }
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row) {
      const cellValue = getCellDefinitiveValue(board[r][col]);
      if (cellValue === num) return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row || c !== col) {
        const cellValue = getCellDefinitiveValue(board[r][c]);
        if (cellValue === num) return false;
      }
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
      const cellValue = board[row][col];
      const definitiveValue = getCellDefinitiveValue(cellValue);
      
      // Cell must have exactly one number
      if (definitiveValue === null) return false;
      
      // Temporarily remove the number to check validity
      const originalValue = board[row][col];
      board[row][col] = 0;
      if (!isValidMove(board, row, col, definitiveValue)) {
        board[row][col] = originalValue;
        return false;
      }
      board[row][col] = originalValue;
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
 * Count occurrences of each number on the board
 * @param {Array} board - Current board state
 * @returns {Object} Object with counts for each number (1-9)
 */
export function getNumberCounts(board) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellValue = board[row][col];
      const definitiveValue = getCellDefinitiveValue(cellValue);
      
      if (definitiveValue !== null && definitiveValue >= 1 && definitiveValue <= 9) {
        counts[definitiveValue]++;
      }
    }
  }
  
  return counts;
}

/**
 * Get array of numbers that are completed (appear 9 times) on the board
 * @param {Array} board - Current board state
 * @returns {Array} Array of completed numbers
 */
export function getCompletedNumbers(board) {
  const counts = getNumberCounts(board);
  return Object.keys(counts)
    .filter(num => counts[num] === 9)
    .map(num => parseInt(num));
}

/**
 * Get array of numbers that are completed AND correctly placed (no conflicts)
 * @param {Array} board - Current board state
 * @returns {Array} Array of correctly completed numbers
 */
export function getCorrectlyCompletedNumbers(board) {
  const completedNumbers = getCompletedNumbers(board);
  const conflictingCells = findConflictingCells(board);
  
  return completedNumbers.filter(num => {
    // Check if any cell with this number is in conflicts
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellValue = getCellDefinitiveValue(board[row][col]);
        if (cellValue === num && conflictingCells.has(`${row},${col}`)) {
          return false; // This number has conflicts, so it's not correctly completed
        }
      }
    }
    return true; // No conflicts found for this number
  });
}

/**
 * Get the color for a specific number (1-9)
 * @param {number} number - Number (1-9)
 * @returns {string} Color hex code
 */
export function getNumberColor(number) {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#e91e63'];
  if (number >= 1 && number <= 9) {
    return colors[number - 1];
  }
  return '#333'; // Default color
}

/**
 * Find all cells that have conflicting numbers (violate Sudoku rules)
 * @param {Array} board - Current board state
 * @returns {Set} Set of cell coordinates as strings "row,col"
 */
export function findConflictingCells(board) {
  const conflicts = new Set();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellValue = getCellDefinitiveValue(board[row][col]);
      
      if (cellValue !== null) {
        // Check if this number conflicts with any other cells
        if (!isValidMove(board, row, col, cellValue)) {
          conflicts.add(`${row},${col}`);
          
          // Also mark the conflicting cells
          // Check row conflicts
          for (let c = 0; c < 9; c++) {
            if (c !== col && getCellDefinitiveValue(board[row][c]) === cellValue) {
              conflicts.add(`${row},${c}`);
            }
          }
          
          // Check column conflicts
          for (let r = 0; r < 9; r++) {
            if (r !== row && getCellDefinitiveValue(board[r][col]) === cellValue) {
              conflicts.add(`${r},${col}`);
            }
          }
          
          // Check 3x3 box conflicts
          const boxRow = Math.floor(row / 3) * 3;
          const boxCol = Math.floor(col / 3) * 3;
          
          for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
              if ((r !== row || c !== col) && getCellDefinitiveValue(board[r][c]) === cellValue) {
                conflicts.add(`${r},${c}`);
              }
            }
          }
        }
      }
    }
  }

  return conflicts;
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