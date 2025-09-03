import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getDifficultySettings } from '../utils/sudoku';

const GameControls = ({ onNewGame, onDifficultyChange, currentDifficulty, gameComplete }) => {
  const difficulties = getDifficultySettings();

  const handleNewGame = () => {
    Alert.alert(
      'New Game',
      'Are you sure you want to start a new game? Current progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'New Game', onPress: onNewGame, style: 'destructive' }
      ]
    );
  };

  const renderDifficultyButton = (key, config) => (
    <TouchableOpacity
      key={key}
      style={[
        styles.difficultyButton,
        currentDifficulty === key && styles.activeDifficulty
      ]}
      onPress={() => onDifficultyChange(key)}
    >
      <Text style={[
        styles.difficultyText,
        currentDifficulty === key && styles.activeDifficultyText
      ]}>
        {config.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {gameComplete && (
        <View style={styles.statusRow}>
          <Text style={styles.completedText}>
            🎉 Completed!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  completedText: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: '600',
  },
  difficultyContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeDifficulty: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  difficultyText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeDifficultyText: {
    color: '#fff',
  },
  newGameButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  newGameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameControls;