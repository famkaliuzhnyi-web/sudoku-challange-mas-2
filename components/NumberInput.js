import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NumberInput = ({ onNumberPress, selectedCell, selectedNumber, completedNumbers = [] }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#e91e63'];

  return (
    <View style={styles.container}>
      <View style={styles.numberGrid}>
        {numbers.map((number, index) => {
          const isSelectedNumber = selectedNumber === number;
          const isCompleted = completedNumbers.includes(number);
          
          return (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                { backgroundColor: isSelectedNumber ? '#f0f0f0' : colors[index] }
              ]}
              onPress={() => onNumberPress(number)}
            >
              <Text style={[
                styles.numberText,
                { color: isSelectedNumber ? '#333' : '#fff' }
              ]}>
                {number}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  numberButton: {
    width: 40,
    height: 55,
    margin: 1,
    borderRadius: 6,
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
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },

});

export default NumberInput;