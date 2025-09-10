import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { getNumberColor } from '../utils/sudoku';

const NumberInput = ({ onNumberPress, selectedCell, selectedNumber, completedNumbers = [] }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Calculate responsive button size based on screen width
  const screenWidth = Dimensions.get('window').width;
  const maxButtonWidth = 40;
  const buttonsPerRow = 9;
  const buttonMargin = 2; // 1px margin on each side
  const totalMargins = buttonMargin * buttonsPerRow * 2;
  const containerPadding = 20;
  const buttonWidth = Math.min(maxButtonWidth, (screenWidth - totalMargins - containerPadding) / buttonsPerRow);
  const buttonHeight = Math.max(45, buttonWidth * 1.2); // Maintain aspect ratio but ensure minimum height
  const fontSize = Math.max(14, buttonWidth * 0.5); // Scale font size with button size

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
                { 
                  width: buttonWidth, 
                  height: buttonHeight,
                  backgroundColor: isSelectedNumber ? '#f0f0f0' : getNumberColor(number) 
                }
              ]}
              onPress={() => onNumberPress(number)}
            >
              <Text style={[
                styles.numberText,
                { 
                  fontSize: fontSize,
                  color: isSelectedNumber ? '#333' : '#fff' 
                }
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
    fontWeight: '600',
    color: '#333',
  },

});

export default NumberInput;