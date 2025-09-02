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

  const renderScoreRow = (key, config) => (
    <View key={key} style={styles.scoreRow}>
      <Text style={styles.scoreDifficulty}>{config.name}</Text>
      <Text style={styles.scoreTime}>{formatTime(bestTimes[key])}</Text>
    </View>
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
          <Text style={styles.sectionTitle}>Best Times</Text>
          <View style={styles.scoresContainer}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreHeaderText}>Difficulty</Text>
              <Text style={styles.scoreHeaderText}>Best Time</Text>
            </View>
            {Object.entries(difficulties).map(([key, config]) => 
              renderScoreRow(key, config)
            )}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  difficultyContainer: {
    alignItems: 'center',
    gap: 15,
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
  scoresContainer: {
    padding: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scoreHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scoreDifficulty: {
    fontSize: 16,
    color: '#333',
  },
  scoreTime: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2196f3',
  },
});

export default MainMenuScreen;