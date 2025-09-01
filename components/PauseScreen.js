import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const PauseScreen = ({ onResume, onRestart, onQuit }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Game Paused</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onResume}>
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.restartButton]} onPress={onRestart}>
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.quitButton]} onPress={onQuit}>
            <Text style={styles.buttonText}>Quit to Main Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    minWidth: 280,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: '#2196f3',
    alignItems: 'center',
  },
  restartButton: {
    backgroundColor: '#ff9800',
  },
  quitButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default PauseScreen;