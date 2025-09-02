import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { getDifficultySettings } from '../utils/sudoku';

const MainMenuScreen = ({ onStartGame, bestTimes }) => {
  const difficulties = getDifficultySettings();

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds) return '--:--';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderDifficultyButton = (key, config) => (
    <TouchableOpacity
      key={key}
      style={styles.difficultyButton}
      onPress={() => onStartGame(key)}
    >
      <Text style={styles.difficultyText}>{config.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sudoku Challenge</Text>
        
        <View style={styles.section}>
          <View style={styles.difficultyContainer}>
            {Object.entries(difficulties).map(([key, config]) => 
              renderDifficultyButton(key, config)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.bestTimesContainer}>
            {Object.entries(difficulties).map(([key, config]) => (
              <View key={key} style={styles.bestTimeItem}>
                <Text style={styles.bestTimeLabel}>{config.name}</Text>
                <Text style={styles.bestTimeValue}>{formatTime(bestTimes[key])}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e8e8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  section: {
    width: '100%',
    marginBottom: 40,
  },

  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  difficultyButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  difficultyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  bestTimesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bestTimeItem: {
    alignItems: 'center',
  },
  bestTimeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  bestTimeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

export default MainMenuScreen;