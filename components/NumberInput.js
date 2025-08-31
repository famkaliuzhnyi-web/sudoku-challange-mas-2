import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NumberInput = ({ onNumberPress, selectedCell }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={styles.container}>
      <View style={styles.numberGrid}>
        {numbers.map(number => (
          <TouchableOpacity
            key={number}
            style={[
              styles.numberButton,
              !selectedCell && styles.disabledButton
            ]}
            onPress={() => onNumberPress(number)}
            disabled={!selectedCell}
          >
            <Text style={[
              styles.numberText,
              !selectedCell && styles.disabledText
            ]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity
        style={[
          styles.clearButton,
          !selectedCell && styles.disabledButton
        ]}
        onPress={() => onNumberPress(0)}
        disabled={!selectedCell}
      >
        <Text style={[
          styles.clearText,
          !selectedCell && styles.disabledText
        ]}>
          Clear
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 240,
  },
  numberButton: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  numberText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    width: 120,
    height: 50,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
});

export default NumberInput;