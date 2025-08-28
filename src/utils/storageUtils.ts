import { type Generation } from '../types';

const HISTORY_KEY = 'generation-history';
const MAX_HISTORY_ITEMS = 5;

export const saveToHistory = (generation: Generation): void => {
  try {
    const existing = getHistory();
    const updated = [generation, ...existing.filter(item => item.id !== generation.id)];
    const trimmed = updated.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
};

export const getHistory = (): Generation[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) as Generation[] : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};