import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { getCellDisplayValue, isCellEmpty, isCellMultiValue, getCellDefinitiveValue, getNumberColor } from '../utils/sudoku';

const SudokuBoard = ({ board, originalBoard, selectedCell, selectedNumber, onCellPress, completedNumbers = [], gameComplete = false, conflictingCells = new Set() }) => {
  // Calculate responsive cell size based on screen width
  const screenWidth = Dimensions.get('window').width;
  const maxCellSize = 45;
  
  // Special sizing for iPhone screens (1179 pixel width) with 3px margins
  let cellSize;
  if (screenWidth === 1179) {
    // For iPhone screen, use smaller size with 3px margins on each side
    const availableWidth = screenWidth - 6; // 3px margin left + 3px margin right
    cellSize = Math.min(40, availableWidth / 9); // Smaller max size for iPhone
  } else {
    // Default responsive calculation for other screens
    const boardPadding = 40; // Account for margins and padding
    cellSize = Math.min(maxCellSize, (screenWidth - boardPadding) / 9);
  }
  
  const fontSize = Math.max(12, cellSize * 0.4); // Scale font size with cell size
  const miniFontSize = Math.max(6, cellSize * 0.2); // Scale mini font size
  const renderCell = (row, col) => {
    const cellValue = board[row][col];
    const displayValue = getCellDisplayValue(cellValue);
    const definitiveValue = getCellDefinitiveValue(cellValue);
    const isOriginal = originalBoard[row][col] !== 0;
    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
    const isEmpty = isCellEmpty(cellValue);
    const isMultiValue = isCellMultiValue(cellValue);
    const isCompletedNumber = definitiveValue !== null && completedNumbers.includes(definitiveValue);
    const isConflicting = conflictingCells.has(`${row},${col}`);
    
    // Determine if this cell should have colored background
    const shouldShowColoredBackground = gameComplete 
      ? false  // Don't show colored backgrounds when game is complete
      : isCompletedNumber && selectedNumber === definitiveValue; // Show color only for selected completed number
    
    // Determine if this cell should have colored text (when game is complete)
    const shouldShowColoredText = gameComplete && definitiveValue !== null;
    
    // Check if this number is highlighted
    const isNumberHighlighted = selectedNumber && (
      (typeof displayValue === 'number' && displayValue === selectedNumber) ||
      (Array.isArray(displayValue) && displayValue.includes(selectedNumber))
    );

    const renderCellContent = () => {
      if (isEmpty) {
        return null;
      } else if (isMultiValue) {
        // Render multiple numbers in a 3x3 grid
        return (
          <View style={styles.multiNumberGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <View key={num} style={styles.miniCell}>
                <Text style={[
                  styles.miniNumberText,
                  { fontSize: miniFontSize },
                  displayValue.includes(num) && styles.visibleMiniNumber,
                  isConflicting && displayValue.includes(num) && styles.conflictingMiniNumber
                ]}>
                  {displayValue.includes(num) ? num : ''}
                </Text>
              </View>
            ))}
          </View>
        );
      } else {
        // Render single number
        return (
          <Text style={[
            styles.cellText,
            { fontSize: fontSize },
            isOriginal && styles.originalText,
            !isOriginal && styles.userText,
            shouldShowColoredBackground && styles.completedNumberText,
            shouldShowColoredText && { color: getNumberColor(definitiveValue) },
            isConflicting && styles.conflictingText,
          ]}>
            {displayValue}
          </Text>
        );
      }
    };

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          { width: cellSize, height: cellSize },
          isSelected && styles.selectedCell,
          shouldShowColoredBackground && !isSelected && { backgroundColor: getNumberColor(definitiveValue) },
          isNumberHighlighted && !isSelected && !shouldShowColoredBackground && !shouldShowColoredText && styles.numberHighlightedCell,
          // Add borders for 3x3 box separation
          col % 3 === 2 && col !== 8 && styles.rightBorder,
          row % 3 === 2 && row !== 8 && styles.bottomBorder,
        ]}
        onPress={() => onCellPress(row, col)}
        disabled={isOriginal}
      >
        {renderCellContent()}
      </TouchableOpacity>
    );
  };

  const renderRow = (rowIndex) => (
    <View key={rowIndex} style={styles.row}>
      {Array(9).fill(null).map((_, colIndex) => renderCell(rowIndex, colIndex))}
    </View>
  );

  return (
    <View style={[
      styles.board,
      // Add 3px margins for iPhone screens (1179 pixel width)
      screenWidth === 1179 && { marginLeft: 3, marginRight: 3 }
    ]}>
      {Array(9).fill(null).map((_, rowIndex) => renderRow(rowIndex))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedCell: {
    backgroundColor: '#e6f3ff',
  },
  highlightedCell: {
    backgroundColor: '#f5f5f5',
  },
  numberHighlightedCell: {
    backgroundColor: '#e0e0e0',
  },
  completedNumberCell: {
    backgroundColor: '#d4edda',
  },
  cellText: {
    fontWeight: '600',
    color: '#333',
  },
  originalText: {
    color: '#000',
    fontWeight: '800',
  },
  userText: {
    color: '#333',
    fontWeight: '300',
  },
  completedNumberText: {
    color: '#fff',
    fontWeight: '600',
  },
  conflictingText: {
    color: '#e74c3c', // Red color for conflicts
    fontWeight: '700',
  },
  rightBorder: {
    borderRightWidth: 2,
    borderRightColor: '#333',
  },
  bottomBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  multiNumberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniCell: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniNumberText: {
    fontWeight: '400',
    color: 'transparent',
  },
  visibleMiniNumber: {
    color: '#666',
  },
  conflictingMiniNumber: {
    color: '#e74c3c', // Red color for conflicts in mini numbers
  },
});

export default SudokuBoard;