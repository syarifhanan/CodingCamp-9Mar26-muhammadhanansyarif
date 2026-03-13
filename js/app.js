// Local Storage Keys
const STORAGE_KEYS = {
  TASKS: 'todo.tasks',
  QUICK_LINKS: 'todo.quickLinks',
  THEME: 'todo.theme',
  SETTINGS: 'todo.settings',
  TIMER: 'todo.timer'
};

// Time Period Constants
const TIME_PERIODS = {
  MORNING: { start: 5, end: 12, greeting: 'Good Morning' },
  AFTERNOON: { start: 12, end: 17, greeting: 'Good Afternoon' },
  EVENING: { start: 17, end: 21, greeting: 'Good Evening' },
  NIGHT: { start: 21, end: 5, greeting: 'Good Night' }
};

// Greeting Component - TimeDisplay Class
class TimeDisplay {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    this.currentTime = new Date();
    this.use24Hour = false;
    this.updateInterval = null;
  }

  start() {
    this.updateTime();
    this.updateInterval = setInterval(() => this.updateTime(), 1000);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  updateTime() {
    this.currentTime = new Date();
    this.element.textContent = this.formatTime(this.currentTime, this.use24Hour);
  }

  formatTime(date, use24Hour) {
    if (use24Hour) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    } else {
      const hours = date.getHours() % 12 || 12;
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
      return `${hours}:${minutes}:${seconds} ${ampm}`;
    }
  }

  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    
    return `${dayName}, ${monthName} ${day}`;
  }

  set24HourFormat(use24Hour) {
    this.use24Hour = use24Hour;
    this.updateTime();
  }
}

// Greeting Component - GreetingService Class
class GreetingService {
  constructor() {
    this.userName = this.getUserName();
  }

  getGreeting(time) {
    const hour = time.getHours();
    
    if (hour >= TIME_PERIODS.MORNING.start && hour < TIME_PERIODS.MORNING.end) {
      return TIME_PERIODS.MORNING.greeting;
    } else if (hour >= TIME_PERIODS.AFTERNOON.start && hour < TIME_PERIODS.AFTERNOON.end) {
      return TIME_PERIODS.AFTERNOON.greeting;
    } else if (hour >= TIME_PERIODS.EVENING.start && hour < TIME_PERIODS.EVENING.end) {
      return TIME_PERIODS.EVENING.greeting;
    } else {
      return TIME_PERIODS.NIGHT.greeting;
    }
  }

  getGreetingWithUserName(time) {
    const greeting = this.getGreeting(time);
    if (this.userName) {
      return `${greeting}, ${this.userName}!`;
    }
    return `${greeting}!`;
  }

  getUserName() {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.userName || '';
      }
    } catch (error) {
      console.error('Failed to load user settings:', error);
    }
    return '';
  }

  setUserName(name) {
    this.userName = name;
    this.saveSettings({ userName: name });
  }

  saveSettings(settings) {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const existingData = existing ? JSON.parse(existing) : {};
      const updated = { ...existingData, ...settings, savedAt: Date.now() };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
}

// Task Class
class Task {
  constructor(text) {
    this.id = this.generateId();
    this.text = text;
    this.completed = false;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  generateId() {
    return 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  validate() {
    if (!this.text || this.text.trim() === '') {
      throw new Error('Task text cannot be empty');
    }
  }
}

// Persistence Service for Tasks
class TaskPersistenceService {
  constructor() {
    this.storageKey = STORAGE_KEYS.TASKS;
  }

  save(tasks) {
    try {
      const data = JSON.stringify(tasks);
      localStorage.setItem(this.storageKey, data);
      return true;
    } catch (error) {
      console.error('Failed to save tasks:', error);
      return false;
    }
  }

  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch (error) {
      console.error('Failed to load tasks:', error);
      return [];
    }
  }
}

// TaskManager Class
class TaskManager {
  constructor() {
    this.tasks = [];
    this.sortOption = 'creation';
    this.persistenceService = new TaskPersistenceService();
    this.load();
  }

  addTask(text) {
    const task = new Task(text);
    task.validate();
    
    // Check for duplicates
    const duplicate = this.tasks.find(t => t.text === task.text);
    if (duplicate) {
      throw new Error('Task already exists');
    }
    
    this.tasks.push(task);
    this.save();
    return task;
  }

  editTask(id, newText) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.text = newText;
    task.updatedAt = Date.now();
    this.save();
  }

  toggleComplete(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.completed = !task.completed;
    task.updatedAt = Date.now();
    this.save();
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(index, 1);
    this.save();
  }

  setSortOption(option) {
    this.sortOption = option;
  }

  getSortedTasks() {
    const tasks = [...this.tasks];
    
    switch (this.sortOption) {
      case 'creation':
        tasks.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'completion':
        tasks.sort((a, b) => {
          if (a.completed === b.completed) return a.createdAt - b.createdAt;
          return a.completed ? 1 : -1;
        });
        break;
      case 'alphabetical':
        tasks.sort((a, b) => a.text.localeCompare(b.text));
        break;
    }
    
    return tasks;
  }

  save() {
    this.persistenceService.save(this.tasks);
  }

  load() {
    this.tasks = this.persistenceService.load();
  }
}

// Focus Timer Class
class FocusTimer {
  constructor() {
    this.duration = 25 * 60; // 25 minutes in seconds
    this.timeRemaining = this.duration;
    this.isActive = false;
    this.isComplete = false;
    this.intervalId = null;
    this.persistenceService = new TimerPersistenceService();
    this.load();
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.isComplete = false;
    
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.save();
  }

  stop() {
    if (!this.isActive) return;
    
    this.isActive = false;
    clearInterval(this.intervalId);
    this.save();
  }

  reset() {
    this.stop();
    this.timeRemaining = this.duration;
    this.isComplete = false;
    this.save();
  }

  setDuration(minutes) {
    const duration = Math.max(1, Math.min(120, parseInt(minutes) || 25)) * 60;
    this.duration = duration;
    this.timeRemaining = duration;
    this.save();
  }

  tick() {
    if (this.timeRemaining > 0) {
      this.timeRemaining--;
      this.save();
      
      if (this.timeRemaining === 0) {
        this.complete();
      }
    }
  }

  complete() {
    this.stop();
    this.isComplete = true;
    this.notifyCompletion();
  }

  notifyCompletion() {
    // Play notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Show notification
    if (Notification.permission === 'granted') {
      new Notification('Timer Complete', {
        body: 'Your focus session has ended!',
        icon: ''
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Timer Complete', {
            body: 'Your focus session has ended!',
            icon: ''
          });
        }
      });
    }
  }

  save() {
    this.persistenceService.save({
      duration: this.duration,
      timeRemaining: this.timeRemaining,
      isActive: this.isActive,
      isComplete: this.isComplete,
      savedAt: Date.now()
    });
  }

  load() {
    const state = this.persistenceService.load();
    if (state) {
      this.duration = state.duration;
      this.timeRemaining = state.timeRemaining;
      this.isActive = state.isActive;
      this.isComplete = state.isComplete;
      
      // Calculate elapsed time and adjust
      if (state.savedAt && this.isActive) {
        const elapsed = Math.floor((Date.now() - state.savedAt) / 1000);
        this.timeRemaining = Math.max(0, this.timeRemaining - elapsed);
        
        if (this.timeRemaining === 0) {
          this.complete();
        } else {
          this.intervalId = setInterval(() => this.tick(), 1000);
        }
      }
    }
  }
}

// Timer Persistence Service
class TimerPersistenceService {
  constructor() {
    this.storageKey = STORAGE_KEYS.TIMER;
  }

  save(state) {
    try {
      const data = JSON.stringify(state);
      localStorage.setItem(this.storageKey, data);
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }

  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load timer state:', error);
      return null;
    }
  }
}

// QuickLink Class
class QuickLink {
  constructor(url, label) {
    this.id = this.generateId();
    this.url = url;
    this.label = label || url;
    this.createdAt = Date.now();
  }

  generateId() {
    return 'link-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  validate() {
    try {
      new URL(this.url);
    } catch (error) {
      throw new Error('Invalid URL');
    }
  }
}

// QuickLinksManager Class
class QuickLinksManager {
  constructor() {
    this.links = [];
    this.persistenceService = new QuickLinksPersistenceService();
    this.load();
  }

  addLink(url, label) {
    const link = new QuickLink(url, label);
    link.validate();
    
    this.links.push(link);
    this.save();
    return link;
  }

  deleteLink(id) {
    const index = this.links.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Quick link not found');
    }
    
    this.links.splice(index, 1);
    this.save();
  }

  openLink(id) {
    const link = this.links.find(l => l.id === id);
    if (!link) {
      throw new Error('Quick link not found');
    }
    
    window.open(link.url, '_blank');
  }

  save() {
    this.persistenceService.save(this.links);
  }

  load() {
    this.links = this.persistenceService.load();
  }
}

// QuickLinks Persistence Service
class QuickLinksPersistenceService {
  constructor() {
    this.storageKey = STORAGE_KEYS.QUICK_LINKS;
  }

  save(links) {
    try {
      const data = JSON.stringify(links);
      localStorage.setItem(this.storageKey, data);
    } catch (error) {
      console.error('Failed to save quick links:', error);
    }
  }

  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load quick links:', error);
      return [];
    }
  }
}

// ThemeManager Class
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.persistenceService = new ThemePersistenceService();
    this.load();
  }

  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      throw new Error('Invalid theme. Must be "light" or "dark".');
    }
    
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.save();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  save() {
    this.persistenceService.save(this.currentTheme);
  }

  load() {
    const savedTheme = this.persistenceService.load();
    if (savedTheme) {
      this.currentTheme = savedTheme;
      this.applyTheme(savedTheme);
    }
  }
}

// Theme Persistence Service
class ThemePersistenceService {
  constructor() {
    this.storageKey = STORAGE_KEYS.THEME;
  }

  save(theme) {
    try {
      const data = JSON.stringify({ theme, savedAt: Date.now() });
      localStorage.setItem(this.storageKey, data);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }

  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return parsed.theme || null;
    } catch (error) {
      console.error('Failed to load theme:', error);
      return null;
    }
  }
}

// Dashboard Class
class Dashboard {
  constructor() {
    this.greetingService = new GreetingService();
    this.timeDisplay = new TimeDisplay('current-time');
    this.taskManager = new TaskManager();
    this.timer = new FocusTimer();
    this.quickLinksManager = new QuickLinksManager();
    this.themeManager = new ThemeManager();
    
    this.init();
  }

  init() {
    this.initGreeting();
    this.initTheme();
    this.initTasks();
    this.initTimer();
    this.initQuickLinks();
    this.initUserSettings();
  }

  initGreeting() {
    // Update time display
    this.timeDisplay.start();
    
    // Update greeting message
    const greetingMessage = document.getElementById('greeting-message');
    const updateGreeting = () => {
      greetingMessage.textContent = this.greetingService.getGreetingWithUserName(new Date());
    };
    
    updateGreeting();
    setInterval(updateGreeting, 60000); // Update every minute
  }

  initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => this.themeManager.toggleTheme());
  }

  initTasks() {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const sortSelect = document.getElementById('sort-select');

    // Add task
    const addTask = () => {
      const text = taskInput.value.trim();
      if (!text) return;
      
      try {
        this.taskManager.addTask(text);
        taskInput.value = '';
        this.renderTasks();
      } catch (error) {
        alert(error.message);
      }
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });

    // Sort tasks
    sortSelect.addEventListener('change', (e) => {
      this.taskManager.setSortOption(e.target.value);
      this.renderTasks();
    });

    this.renderTasks();
  }

  renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    const tasks = this.taskManager.getSortedTasks();
    
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;
      
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${this.escapeHtml(task.text)}</span>
        <div class="task-actions">
          <button class="task-edit">Edit</button>
          <button class="task-delete">Delete</button>
        </div>
      `;
      
      taskList.appendChild(li);
    });

    // Add event listeners for task actions
    taskList.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const id = e.target.closest('.task-item').dataset.id;
        this.taskManager.toggleComplete(id);
        this.renderTasks();
      });
    });

    taskList.querySelectorAll('.task-edit').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.closest('.task-item').dataset.id;
        const task = this.taskManager.tasks.find(t => t.id === id);
        if (task) {
          const newText = prompt('Edit task:', task.text);
          if (newText !== null && newText.trim()) {
            this.taskManager.editTask(id, newText.trim());
            this.renderTasks();
          }
        }
      });
    });

    taskList.querySelectorAll('.task-delete').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.closest('.task-item').dataset.id;
        this.taskManager.deleteTask(id);
        this.renderTasks();
      });
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  initTimer() {
    const timerDisplay = document.getElementById('timer-time');
    const timerStart = document.getElementById('timer-start');
    const timerStop = document.getElementById('timer-stop');
    const timerReset = document.getElementById('timer-reset');
    const timerDuration = document.getElementById('timer-duration');

    const updateTimerDisplay = () => {
      const minutes = Math.floor(this.timer.timeRemaining / 60);
      const seconds = this.timer.timeRemaining % 60;
      timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    updateTimerDisplay();

    timerStart.addEventListener('click', () => this.timer.start());
    timerStop.addEventListener('click', () => this.timer.stop());
    timerReset.addEventListener('click', () => this.timer.reset());
    
    timerDuration.addEventListener('change', (e) => {
      this.timer.setDuration(e.target.value);
      updateTimerDisplay();
    });

    // Update timer display every second
    setInterval(() => {
      if (this.timer.isActive) {
        updateTimerDisplay();
      }
    }, 1000);
  }

  initQuickLinks() {
    const linkUrl = document.getElementById('link-url');
    const linkLabel = document.getElementById('link-label');
    const addLinkBtn = document.getElementById('add-link-btn');
    const quickLinkList = document.getElementById('quick-link-list');

    const addLink = () => {
      const url = linkUrl.value.trim();
      const label = linkLabel.value.trim();
      
      if (!url) return;
      
      try {
        this.quickLinksManager.addLink(url, label);
        linkUrl.value = '';
        linkLabel.value = '';
        this.renderQuickLinks();
      } catch (error) {
        alert(error.message);
      }
    };

    addLinkBtn.addEventListener('click', addLink);
    linkUrl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addLink();
    });

    this.renderQuickLinks();
  }

  renderQuickLinks() {
    const quickLinkList = document.getElementById('quick-link-list');
    quickLinkList.innerHTML = '';
    
    this.quickLinksManager.links.forEach(link => {
      const li = document.createElement('li');
      li.className = 'quick-link-item';
      li.dataset.id = link.id;
      
      li.innerHTML = `
        <a href="${this.escapeHtml(link.url)}" target="_blank">${this.escapeHtml(link.label)}</a>
        <div class="quick-link-actions">
          <button class="quick-link-delete">Delete</button>
        </div>
      `;
      
      quickLinkList.appendChild(li);
    });

    // Add event listeners for link actions
    quickLinkList.querySelectorAll('.quick-link-delete').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.closest('.quick-link-item').dataset.id;
        this.quickLinksManager.deleteLink(id);
        this.renderQuickLinks();
      });
    });
  }

  initUserSettings() {
    // User settings modal would go here
    const userSettingsBtn = document.getElementById('user-settings');
    userSettingsBtn.addEventListener('click', () => {
      const userName = prompt('Enter your name (optional):', this.greetingService.getUserName());
      if (userName !== null) {
        this.greetingService.setUserName(userName);
        // Update greeting immediately
        document.getElementById('greeting-message').textContent = this.greetingService.getGreetingWithUserName(new Date());
      }
    });
  }
}

// Initialize Dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check for required browser APIs
  if (!('localStorage' in window) || window.localStorage === null) {
    alert('Your browser does not support Local Storage. Please enable it or use a different browser.');
    return;
  }

  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications.');
  }

  // Initialize dashboard
  const dashboard = new Dashboard();
});
