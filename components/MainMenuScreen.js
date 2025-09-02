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
        <Text style={styles.title}>Sudoku</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Levels</Text>
          <View style={styles.difficultyContainer}>
            {Object.entries(difficulties).map(([key, config]) => 
              renderDifficultyButton(key, config)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Times</Text>
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
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 60,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginBottom: 50,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  difficultyButton: {
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
  difficultyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  bestTimesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  bestTimeItem: {
    alignItems: 'center',
  },
  bestTimeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  bestTimeValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default MainMenuScreen;