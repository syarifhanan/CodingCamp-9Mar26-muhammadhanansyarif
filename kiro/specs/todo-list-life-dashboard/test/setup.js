// Test setup file
// This file runs before each test file

// Mock localStorage for testing
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// Override global localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Notification
window.Notification = function() {};
window.Notification.permission = 'granted';
window.Notification.requestPermission = function() {
  return Promise.resolve('granted');
};

// Mock AudioContext
window.AudioContext = class AudioContext {
  constructor() {
    this.currentTime = 0;
  }
  createOscillator() {
    return {
      connect: () => {},
      frequency: { value: 0 },
      type: '',
      start: () => {},
      stop: () => {}
    };
  }
  createGain() {
    return {
      connect: () => {},
      gain: { value: 0, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }
    };
  }
};

// Mock window.open
window.open = function() {};

// Cleanup after each test
afterEach(() => {
  localStorage.clear();
});
