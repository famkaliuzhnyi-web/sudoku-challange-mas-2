import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SudokuBoard from './components/SudokuBoard';
import NumberInput from './components/NumberInput';
import GameControls from './components/GameControls';
import MainMenuScreen from './components/MainMenuScreen';
import PauseScreen from './components/PauseScreen';
import { generateSudoku, isValidMove, isSolved, copyBoard, getDifficultySettings } from './utils/sudoku';
import { getBestTimes, setBestTime } from './utils/storage';

export default function App() {
  const [screen, setScreen] = useState('menu'); // 'menu', 'game', 'pause'
  const [board, setBoard] = useState(null);
  const [originalBoard, setOriginalBoard] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [mistakes, setMistakes] = useState([]);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [bestTimes, setBestTimes] = useState(getBestTimes());
  const [startTime, setStartTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);

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
    setMistakes([]);
    setMistakeCount(0);
    setGameComplete(false);
    setStartTime(Date.now());
    setGameTime(0);
    setScreen('game');
  };

  const restartGame = () => {
    // Restart with the same board
    setBoard(copyBoard(originalBoard));
    setSelectedCell(null);
    setSelectedNumber(null);
    setMistakes([]);
    setMistakeCount(0);
    setGameComplete(false);
    setStartTime(Date.now());
    setGameTime(0);
    setScreen('game');
  };

  const handleCellPress = (row, col) => {
    // Don't allow selection of original cells
    if (originalBoard[row][col] !== 0) return;
    
    // If clicking on a cell that already has a number, clear it
    if (board[row][col] !== 0) {
      const newBoard = copyBoard(board);
      newBoard[row][col] = 0;
      // Remove from mistakes if it was a mistake
      setMistakes(prev => prev.filter(m => !(m.row === row && m.col === col)));
      setBoard(newBoard);
      setSelectedCell(null);
      setSelectedNumber(null);
      return;
    }
    
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number) => {
    setSelectedNumber(number);
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newBoard = copyBoard(board);
    
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
    
    setBoard(newBoard);
    
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
        `You solved the puzzle in ${formatTime(completionTime)}!\n` +
        `Mistakes: ${mistakeCount}` +
        (isNewRecord ? '\n🎉 New best time!' : ''),
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
        setSelectedNumber(null);
        setMistakes([]);
        setMistakeCount(0);
        setGameComplete(false);
        setStartTime(Date.now());
        setGameTime(0);
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
                mistakes={mistakes}
              />
              
              <NumberInput
                onNumberPress={handleNumberInput}
                selectedCell={selectedCell}
                selectedNumber={selectedNumber}
              />
              
              <GameControls
                onNewGame={() => startNewGame(difficulty)}
                onDifficultyChange={handleDifficultyChange}
                currentDifficulty={difficulty}
                gameComplete={gameComplete}
                mistakes={mistakeCount}
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
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    paddingHorizontal: 12,
    paddingTop: 15,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginTop: 50,
  },
});
