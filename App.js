import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SudokuBoard from './components/SudokuBoard';
import NumberInput from './components/NumberInput';
import GameControls from './components/GameControls';
import MainMenuScreen from './components/MainMenuScreen';
import PauseScreen from './components/PauseScreen';
import { generateSudoku, isValidMove, isSolved, copyBoard, getDifficultySettings, isCellEmpty, isCellMultiValue, setDefinitiveNumber, toggleNumberInCell, getCompletedNumbers, getCorrectlyCompletedNumbers, getNumberColor, findConflictingCells } from './utils/sudoku';
import { getBestTimes, setBestTime } from './utils/storage';

export default function App() {
  const [screen, setScreen] = useState('menu'); // 'menu', 'game', 'pause'
  const [board, setBoard] = useState(null);
  const [originalBoard, setOriginalBoard] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');

  const [gameComplete, setGameComplete] = useState(false);
  const [bestTimes, setBestTimes] = useState(getBestTimes());
  const [startTime, setStartTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  const [conflictingCells, setConflictingCells] = useState(new Set());


  useEffect(() => {
    let interval;
    if (screen === 'game' && startTime && !gameComplete) {
      interval = setInterval(() => {
        setGameTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, startTime, gameComplete]);

  const startNewGame = (selectedDifficulty = difficulty) => {
    setDifficulty(selectedDifficulty);
    const difficultySettings = getDifficultySettings();
    const newBoard = generateSudoku(difficultySettings[selectedDifficulty].difficulty);
    setBoard(copyBoard(newBoard));
    setOriginalBoard(copyBoard(newBoard));
    setSelectedCell(null);
    setSelectedNumber(null);
    setGameComplete(false);
    setStartTime(Date.now());
    setGameTime(0);
    setConflictingCells(new Set());
    setScreen('game');
  };

  const restartGame = () => {
    // Restart with the same board
    setBoard(copyBoard(originalBoard));
    setSelectedCell(null);
    setSelectedNumber(null);
    setGameComplete(false);
    setStartTime(Date.now());
    setGameTime(0);
    setConflictingCells(new Set());
    setScreen('game');
  };

  const handleCellPress = (row, col) => {
    // Don't allow selection of original cells
    if (originalBoard[row][col] !== 0) return;
    
    // If no number is selected, just select the cell
    if (!selectedNumber) {
      setSelectedCell({ row, col });
      return;
    }
    
    // Toggle the selected number in the cell
    const newBoard = copyBoard(board);
    const currentCellValue = board[row][col];
    
    // Toggle the number in the cell (add if not present, remove if present)
    newBoard[row][col] = toggleNumberInCell(currentCellValue, selectedNumber);
    
    setBoard(newBoard);
    setSelectedCell(null);
    
    // Update conflicting cells
    const conflicts = findConflictingCells(newBoard);
    setConflictingCells(conflicts);
    
    // Check if game is complete
    if (isSolved(newBoard)) {
      setGameComplete(true);
      setSelectedCell(null);
      setSelectedNumber(null);
      
      // Calculate completion time and check for new record
      const completionTime = Math.floor((Date.now() - startTime) / 1000);
      const isNewRecord = setBestTime(difficulty, completionTime);
      setBestTimes(getBestTimes());
      
      const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };
      
      Alert.alert(
        'Congratulations!',
        `You solved the puzzle in ${formatTime(completionTime)}!` +
        (isNewRecord ? '\n🎉 New best time!' : ''),
        [{ text: 'OK', onPress: handleQuit }]
      );
    }
  };

  const handleNumberInput = (number) => {
    setSelectedNumber(number);
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
        setSelectedNumber(null);
        setGameComplete(false);
        setStartTime(Date.now());
        setGameTime(0);
        setConflictingCells(new Set());
      }, 100);
    }
  };

  const handlePause = () => {
    setScreen('pause');
  };

  const handleResume = () => {
    setScreen('game');
  };

  const handleQuit = () => {
    setScreen('menu');
    setBoard(null);
    setOriginalBoard(null);
    setConflictingCells(new Set());
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (screen === 'menu') {
    return (
      <>
        <StatusBar style="auto" />
        <MainMenuScreen 
          onStartGame={startNewGame}
          bestTimes={bestTimes}
        />
      </>
    );
  }

  if (screen === 'pause') {
    return (
      <>
        <StatusBar style="auto" />
        <PauseScreen
          onResume={handleResume}
          onRestart={restartGame}
          onQuit={handleQuit}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
              <Text style={styles.pauseButtonText}>Pause</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Sudoku</Text>
          <View style={styles.headerRight}>
            <Text style={styles.timer}>{formatTime(gameTime)}</Text>
          </View>
        </View>
        
        <View style={styles.gameContainer}>
          {board && originalBoard ? (
            <>
              <SudokuBoard
                board={board}
                originalBoard={originalBoard}
                selectedCell={selectedCell}
                selectedNumber={selectedNumber}
                onCellPress={handleCellPress}
                completedNumbers={getCorrectlyCompletedNumbers(board)}
                gameComplete={gameComplete}
                conflictingCells={conflictingCells}
              />
              
              <View style={styles.inputSection}>
                <NumberInput
                  onNumberPress={handleNumberInput}
                  selectedCell={selectedCell}
                  selectedNumber={selectedNumber}
                  completedNumbers={board ? getCorrectlyCompletedNumbers(board) : []}
                />
              </View>
              
              <GameControls
                onNewGame={() => startNewGame(difficulty)}
                onDifficultyChange={handleDifficultyChange}
                currentDifficulty={difficulty}
                gameComplete={gameComplete}
              />
            </>
          ) : (
            <Text style={styles.loadingText}>Generating puzzle...</Text>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  pauseButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pauseButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  timer: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196f3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  gameContainer: {
    flex: 1,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginTop: 50,
  },
  inputSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});
