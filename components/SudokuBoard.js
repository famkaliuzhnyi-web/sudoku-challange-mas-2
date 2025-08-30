import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SudokuBoard = ({ board, originalBoard, selectedCell, onCellPress, mistakes = [] }) => {
  const renderCell = (row, col) => {
    const value = board[row][col];
    const isOriginal = originalBoard[row][col] !== 0;
    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
    const isMistake = mistakes.some(mistake => mistake.row === row && mistake.col === col);
    
    // Highlight cells in the same row, column, or 3x3 box as selected cell
    const isHighlighted = selectedCell && (
      selectedCell.row === row ||
      selectedCell.col === col ||
      (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
       Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
    );

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          isSelected && styles.selectedCell,
          isHighlighted && !isSelected && styles.highlightedCell,
          isMistake && styles.mistakeCell,
          // Add borders for 3x3 box separation
          col % 3 === 2 && col !== 8 && styles.rightBorder,
          row % 3 === 2 && row !== 8 && styles.bottomBorder,
        ]}
        onPress={() => onCellPress(row, col)}
        disabled={isOriginal}
      >
        <Text style={[
          styles.cellText,
          isOriginal && styles.originalText,
          isMistake && styles.mistakeText,
        ]}>
          {value !== 0 ? value : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRow = (rowIndex) => (
    <View key={rowIndex} style={styles.row}>
      {Array(9).fill(null).map((_, colIndex) => renderCell(rowIndex, colIndex))}
    </View>
  );

  return (
    <View style={styles.board}>
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
    width: 40,
    height: 40,
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
  mistakeCell: {
    backgroundColor: '#ffebee',
  },
  cellText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  originalText: {
    color: '#000',
    fontWeight: '800',
  },
  mistakeText: {
    color: '#d32f2f',
  },
  rightBorder: {
    borderRightWidth: 2,
    borderRightColor: '#333',
  },
  bottomBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
});

export default SudokuBoard;