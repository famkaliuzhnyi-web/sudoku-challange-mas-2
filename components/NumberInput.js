import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NumberInput = ({ onNumberPress, onDelete, selectedCell, selectedNumber, noteMode = false }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#e91e63'];

  return (
    <View style={styles.container}>
      <View style={styles.numberGrid}>
        {numbers.map((number, index) => {
          const isSelectedNumber = selectedNumber === number;
          return (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                !selectedCell && styles.disabledButton,
                { backgroundColor: isSelectedNumber ? '#fff9e6' : colors[index] },
                noteMode && styles.noteModeBorder
              ]}
              onPress={() => onNumberPress(number)}
              disabled={!selectedCell}
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
        
        <TouchableOpacity
          style={[
            styles.deleteButton,
            !selectedCell && styles.disabledButton,
          ]}
          onPress={onDelete}
          disabled={!selectedCell}
        >
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 15,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  numberButton: {
    width: 32,
    height: 45,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  disabledButton: {
    opacity: 0.6,
  },
  noteModeBorder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#999',
  },
  deleteButton: {
    width: 32,
    height: 45,
    margin: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  deleteText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
});

export default NumberInput;