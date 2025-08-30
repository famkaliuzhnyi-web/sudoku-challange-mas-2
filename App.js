import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SudokuBoard from './components/SudokuBoard';
import NumberInput from './components/NumberInput';
import GameControls from './components/GameControls';
import { generateSudoku, isValidMove, isSolved, copyBoard, getDifficultySettings } from './utils/sudoku';

export default function App() {
  const [board, setBoard] = useState([]);
  const [originalBoard, setOriginalBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [mistakes, setMistakes] = useState([]);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const difficultySettings = getDifficultySettings();
    const newBoard = generateSudoku(difficultySettings[difficulty].difficulty);
    setBoard(copyBoard(newBoard));
    setOriginalBoard(copyBoard(newBoard));
    setSelectedCell(null);
    setMistakes([]);
    setMistakeCount(0);
    setGameComplete(false);
  };

  const handleCellPress = (row, col) => {
    // Don't allow selection of original cells
    if (originalBoard[row][col] !== 0) return;
    
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newBoard = copyBoard(board);
    
    if (number === 0) {
      // Clear cell
      newBoard[row][col] = 0;
      // Remove from mistakes if it was a mistake
      setMistakes(prev => prev.filter(m => !(m.row === row && m.col === col)));
    } else {
      // Check if move is valid
      if (isValidMove(newBoard, row, col, number)) {
        newBoard[row][col] = number;
        // Remove from mistakes if it was a mistake
        setMistakes(prev => prev.filter(m => !(m.row === row && m.col === col)));
      } else {
        // Invalid move - mark as mistake
        newBoard[row][col] = number;
        setMistakes(prev => {
          const existing = prev.find(m => m.row === row && m.col === col);
          if (!existing) {
            setMistakeCount(count => count + 1);
            return [...prev, { row, col }];
          }
          return prev;
        });
      }
    }
    
    setBoard(newBoard);
    
    // Check if game is complete
    if (isSolved(newBoard)) {
      setGameComplete(true);
      setSelectedCell(null);
      Alert.alert(
        'Congratulations!',
        `You solved the puzzle with ${mistakeCount} mistakes!`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty);
      // Generate new game with new difficulty
      setTimeout(() => {
        const difficultySettings = getDifficultySettings();
        const newBoard = generateSudoku(difficultySettings[newDifficulty].difficulty);
        setBoard(copyBoard(newBoard));
        setOriginalBoard(copyBoard(newBoard));
        setSelectedCell(null);
        setMistakes([]);
        setMistakeCount(0);
        setGameComplete(false);
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Sudoku Challenge</Text>
        </View>
        
        <View style={styles.gameContainer}>
          <SudokuBoard
            board={board}
            originalBoard={originalBoard}
            selectedCell={selectedCell}
            onCellPress={handleCellPress}
            mistakes={mistakes}
          />
          
          <NumberInput
            onNumberPress={handleNumberInput}
            selectedCell={selectedCell}
          />
          
          <GameControls
            onNewGame={startNewGame}
            onDifficultyChange={handleDifficultyChange}
            currentDifficulty={difficulty}
            gameComplete={gameComplete}
            mistakes={mistakeCount}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  gameContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    alignItems: 'center',
  },
});
