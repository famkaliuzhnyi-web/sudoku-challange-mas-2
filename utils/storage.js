// Simple storage utility for best times
// In a real app, you'd use AsyncStorage or similar persistence
let storage = {
  bestTimes: {
    easy: null,
    medium: null,
    hard: null
  }
};

export const getBestTimes = () => {
  return { ...storage.bestTimes };
};

export const setBestTime = (difficulty, timeInSeconds) => {
  if (!storage.bestTimes[difficulty] || timeInSeconds < storage.bestTimes[difficulty]) {
    storage.bestTimes[difficulty] = timeInSeconds;
    return true; // New record
  }
  return false;
};

export const clearBestTimes = () => {
  storage.bestTimes = {
    easy: null,
    medium: null,
    hard: null
  };
};