# Design Document: To-Do List Life Dashboard

## Overview

The To-Do List Life Dashboard is a client-side web application that helps users organize their daily activities. The dashboard displays current time and date, manages a to-do list with persistence, provides a focus timer for productivity sessions, and offers quick access to frequently visited websites. The application runs entirely in the browser using HTML, CSS, and vanilla JavaScript with Local Storage for data persistence.

### Key Features

- **Time and Date Display**: Real-time clock with time-based greetings
- **Task Management**: Add, edit, mark complete, delete tasks with persistence
- **Focus Timer**: 25-minute countdown timer for productivity sessions
- **Quick Links**: Save and access favorite websites
- **Theme Switching**: Light and dark mode support

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Dashboard UI                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Greeting     │  │ Task List    │  │ Focus Timer  │      │
│  │ Component    │  │              │  │              │      │
│  │ - Time/Date  │  │ - Task items │  │ - Countdown  │      │
│  │ - Greeting   │  │ - Sort       │  │ - Controls   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ Quick Links  │  │ Theme Toggle │                         │
│  │              │  │              │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Core                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ TaskManager  │  │ TimerManager │  │ ThemeManager │      │
│  │              │  │              │  │              │      │
│  │ - CRUD ops   │  │ - Countdown  │  │ - Theme      │      │
│  │ - Persistence│  │ - State      │  │ - Switch     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                                            │
│  │ Storage      │                                            │
│  │ - Local      │                                            │
│  │   Storage    │                                            │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```
Dashboard
├── GreetingComponent
│   ├── TimeDisplay
│   └── DateDisplay
├── TaskManager
│   ├── TaskList
│   ├── TaskInput
│   └── TaskItem (x N)
├── FocusTimer
│   ├── TimerDisplay
│   ├── TimerControls
│   └── TimerSettings
├── QuickLinksManager
│   ├── QuickLinkList
│   ├── QuickLinkInput
│   └── QuickLinkItem (x N)
└── ThemeManager
    └── ThemeToggle
```

## Components and Interfaces

### GreetingComponent

Displays current time, date, and time-based greeting.

**Properties:**
- `currentTime`: Date object
- `greeting`: String (morning/afternoon/evening/night)
- `userName`: String (optional, from Local Storage)

**Methods:**
- `updateTime()`: Update displayed time
- `getGreeting(time)`: Return appropriate greeting based on time
- `formatTime(date, use24Hour)`: Format time string
- `formatDate(date)`: Format date string

**Events:**
- `timeUpdated`: Emitted when time changes
- `greetingChanged`: Emitted when greeting changes

### TaskManager

Manages task lifecycle and persistence.

**Properties:**
- `tasks`: Array of Task objects
- `sortOption`: String ('creation', 'completion', 'alphabetical')
- `isDirty`: Boolean (indicates pending save)

**Methods:**
- `addTask(text)`: Add new task
- `editTask(id, newText)`: Edit existing task
- `toggleComplete(id)`: Toggle completion status
- `deleteTask(id)`: Remove task
- `setSortOption(option)`: Change sort order
- `getSortedTasks()`: Return tasks sorted by current option
- `save()`: Persist to Local Storage
- `load()`: Load from Local Storage

**Events:**
- `taskAdded`: Emitted when task is added
- `taskUpdated`: Emitted when task is modified
- `taskDeleted`: Emitted when task is deleted
- `tasksSorted`: Emitted when sort order changes
- `saved`: Emitted after successful save

### FocusTimer

Manages focus session timer.

**Properties:**
- `duration`: Number (minutes, default 25)
- `timeRemaining`: Number (seconds)
- `isActive`: Boolean
- `isComplete`: Boolean

**Methods:**
- `start()`: Begin countdown
- `stop()`: Pause countdown
- `reset()`: Restore to full duration
- `setDuration(minutes)`: Configure timer duration
- `tick()`: Update timer (called every second)
- `complete()`: Mark session as complete

**Events:**
- `timerStarted`: Emitted when timer starts
- `timerStopped`: Emitted when timer pauses
- `timerReset`: Emitted when timer resets
- `timerTick`: Emitted every second
- `timerComplete`: Emitted when timer reaches zero

### QuickLinksManager

Manages quick link collection and persistence.

**Properties:**
- `links`: Array of QuickLink objects

**Methods:**
- `addLink(url, label)`: Add new quick link
- `deleteLink(id)`: Remove quick link
- `openLink(id)`: Open link in new tab
- `save()`: Persist to Local Storage
- `load()`: Load from Local Storage

**Events:**
- `linkAdded`: Emitted when link is added
- `linkDeleted`: Emitted when link is deleted
- `saved`: Emitted after successful save

### ThemeManager

Manages theme switching and persistence.

**Properties:**
- `currentTheme`: String ('light' or 'dark')
- `isDarkMode`: Boolean

**Methods:**
- `setTheme(theme)`: Change theme
- `toggleTheme()`: Switch between light/dark
- `applyTheme(theme)`: Apply CSS classes
- `save()`: Persist preference to Local Storage
- `load()`: Load preference from Local Storage

**Events:**
- `themeChanged`: Emitted when theme changes
- `saved`: Emitted after successful save

## Data Models

### Task

```javascript
{
  id: string,           // UUID
  text: string,         // Task description
  completed: boolean,   // Completion status
  createdAt: number,    // Timestamp (ms since epoch)
  updatedAt: number     // Timestamp (ms since epoch)
}
```

### QuickLink

```javascript
{
  id: string,           // UUID
  url: string,          // URL to open
  label: string,        // Display label
  createdAt: number     // Timestamp (ms since epoch)
}
```

### ThemePreference

```javascript
{
  theme: string,        // 'light' or 'dark'
  savedAt: number       // Timestamp (ms since epoch)
}
```

### UserSettings

```javascript
{
  userName: string,     // Optional user name for greeting
  timeFormat: string,   // '12' or '24'
  savedAt: number       // Timestamp (ms since epoch)
}
```

## Local Storage Schema

```javascript
// Task data
localStorage.setItem('todo.tasks', JSON.stringify([
  { id: 'uuid', text: 'Task 1', completed: false, createdAt: 1234567890, updatedAt: 1234567890 }
]))

// Quick links data
localStorage.setItem('todo.quickLinks', JSON.stringify([
  { id: 'uuid', url: 'https://example.com', label: 'Example', createdAt: 1234567890 }
]))

// Theme preference
localStorage.setItem('todo.theme', JSON.stringify({ theme: 'dark', savedAt: 1234567890 }))

// User settings
localStorage.setItem('todo.settings', JSON.stringify({ 
  userName: 'John', 
  timeFormat: '24',
  savedAt: 1234567890 
}))
```

## Timer Implementation Approach

### Timer Logic

The timer uses `setInterval` for countdown with the following considerations:

1. **Accuracy**: Use `Date.now()` to calculate elapsed time rather than relying solely on interval ticks
2. **Persistence**: Save timer state on each tick for recovery after page reload
3. **Performance**: Use CSS transitions for smooth UI updates

### Timer State Persistence

```javascript
// Save timer state
{
  duration: 25 * 60,        // 25 minutes in seconds
  timeRemaining: 1500,      // Current remaining time
  isActive: true,           // Timer state
  savedAt: Date.now()       // When state was saved
}
```

### Timer Recovery

On page load:
1. Load saved timer state from Local Storage
2. Calculate elapsed time since save
3. Adjust `timeRemaining` based on elapsed time
4. Resume or pause based on saved `isActive` state

## Theme Switching Mechanism

### CSS Variables

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent: #007bff;
  --border: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #aaaaaa;
  --accent: #4dabf7;
  --border: #404040;
}
```

### Theme Application

1. Load saved theme from Local Storage on initialization
2. Apply `data-theme` attribute to `<html>` or `<body>` element
3. Update theme toggle button state
4. Emit `themeChanged` event for other components to react

### Theme Persistence

```javascript
// Save theme preference
{
  theme: 'dark',
  savedAt: Date.now()
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time format conversion

*For any* valid time in 24-hour format, converting to 12-hour format and back should produce the original time.

**Validates: Requirements 1.1**

### Property 2: Date formatting completeness

*For any* valid date, formatting should include day of week, month name, and day number.

**Validates: Requirements 1.2**

### Property 3: Time update frequency

*For any* running clock, the displayed time should update at approximately 1 second intervals.

**Validates: Requirements 1.3**

### Property 4: Time-based greeting selection

*For any* time of day, the greeting should match the correct time period (morning 5AM-12PM, afternoon 12PM-5PM, evening 5PM-9PM, night 9PM-5AM).

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 5: Custom name inclusion

*For any* greeting, if a custom name is configured, the greeting message should include that name.

**Validates: Requirements 2.5**

### Property 6: Task addition increases list size

*For any* task list and valid (non-empty) task text, adding the task should increase the list size by one.

**Validates: Requirements 3.1**

### Property 7: Duplicate task rejection

*For any* task list containing a task with specific text, attempting to add another task with the same text should be rejected and the list unchanged.

**Validates: Requirements 3.2**

### Property 8: Task editing preserves other fields

*For any* task, editing the text should preserve all other task properties (id, completion status, timestamps).

**Validates: Requirements 3.3**

### Property 9: Task completion toggle

*For any* task, toggling completion status should flip the completed boolean value.

**Validates: Requirements 3.4, 3.5**

### Property 10: Task deletion removes item

*For any* task list and valid task id, deleting the task should remove it from the list.

**Validates: Requirements 3.6**

### Property 11: Task persistence round trip

*For any* valid task list, saving to Local Storage then loading should produce an equivalent task list.

**Validates: Requirements 3.7, 4.4**

### Property 12: Empty storage initialization

*For any* empty Local Storage, loading tasks should produce an empty task list.

**Validates: Requirements 4.2**

### Property 13: Corrupted data handling

*For any* corrupted or invalid Local Storage data, loading should produce an empty task list and log an error.

**Validates: Requirements 4.3**

### Property 14: Sort option availability

*For any* task list, the available sort options should include creation order, completion status, and alphabetical.

**Validates: Requirements 5.1**

### Property 15: Sort correctness

*For any* task list and sort option, applying the sort should order tasks according to the selected criteria.

**Validates: Requirements 5.2**

### Property 16: Timer default duration

*For any* new timer instance, the initial duration should be 25 minutes (1500 seconds).

**Validates: Requirements 6.1**

### Property 17: Timer countdown accuracy

*For any* running timer, the time remaining should decrease by approximately 1 second per second.

**Validates: Requirements 6.2**

### Property 18: Timer completion notification

*For any* timer that reaches zero, a completion notification should be triggered.

**Validates: Requirements 6.3**

### Property 19: Timer pause and resume

*For any* running timer, pausing and resuming should maintain the correct time remaining.

**Validates: Requirements 6.4**

### Property 20: Timer reset

*For any* timer, resetting should restore the time remaining to the configured duration.

**Validates: Requirements 6.5**

### Property 21: Timer update frequency

*For any* running timer, the display should update every second.

**Validates: Requirements 6.6**

### Property 22: Custom timer duration

*For any* timer, the duration should be configurable by the user.

**Validates: Requirements 6.7**

### Property 23: Quick link addition

*For any* quick link list and valid URL/label, adding a quick link should increase the list size by one.

**Validates: Requirements 7.1**

### Property 24: Quick link opening

*For any* quick link, clicking should open the associated URL in a new tab.

**Validates: Requirements 7.2**

### Property 25: Quick link deletion

*For any* quick link list and valid quick link id, deleting should remove the link from the list.

**Validates: Requirements 7.3**

### Property 26: Quick link persistence round trip

*For any* valid quick link collection, saving to Local Storage then loading should produce an equivalent collection.

**Validates: Requirements 7.4, 7.6**

### Property 27: Quick link loading

*For any* saved quick link data, loading should restore all quick links.

**Validates: Requirements 7.5**

### Property 28: Theme availability

*For any* dashboard instance, both light and dark theme options should be available.

**Validates: Requirements 8.1**

### Property 29: Theme application

*For any* theme selection, applying the theme should update visual styles within 100 milliseconds.

**Validates: Requirements 8.2**

### Property 30: Theme persistence

*For any* theme selection, the preference should be saved to Local Storage.

**Validates: Requirements 8.3**

### Property 31: Theme restoration

*For any* saved theme preference, loading should apply the saved theme.

**Validates: Requirements 8.4**

### Property 32: Default theme

*For any* dashboard with no saved theme preference, the light theme should be applied by default.

**Validates: Requirements 8.5**

### Property 33: Load performance

*For any* dashboard load, the initial interface should display within 1 second.

**Validates: Requirements 9.1**

### Property 34: UI responsiveness

*For any* user action, visual feedback should occur within 100 milliseconds.

**Validates: Requirements 9.2**

### Property 35: Large list performance

*For any* task list with up to 100 tasks, interactions should remain responsive with no perceptible lag.

**Validates: Requirements 9.3**

### Property 36: Browser API availability

*For any* required browser API, if unavailable, an error message should be displayed indicating browser incompatibility.

**Validates: Requirements 10.3**

## Error Handling

### Local Storage Errors

```javascript
try {
  const data = localStorage.getItem('todo.tasks');
  if (!data) return [];
  return JSON.parse(data);
} catch (error) {
  console.error('Failed to load tasks:', error);
  return [];
}
```

### Invalid Data Handling

- Validate JSON structure before parsing
- Check for required fields in each record
- Log errors with context for debugging
- Gracefully degrade to empty state

### Timer Errors

- Handle cases where `setInterval` fails
- Validate duration values (positive integers)
- Handle page visibility changes (pause when hidden)

### Theme Errors

- Validate theme values ('light' or 'dark')
- Fall back to default theme on invalid values
- Handle CSS variable application failures

## Testing Strategy

### Dual Testing Approach

This implementation requires both unit tests and property-based tests for comprehensive coverage.

### Unit Testing

Unit tests will focus on:
- Specific examples that demonstrate correct behavior
- Integration points between components
- Edge cases and error conditions
- Browser API mocking scenarios

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using the fast-check library.

**Property Test Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with feature name and property reference
- Random data generation for comprehensive coverage

### Property-Based Testing Library

**fast-check** - A property-based testing library for JavaScript/TypeScript

**Installation:**
```bash
npm install --save-dev fast-check
```

**Configuration:**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testPathIgnorePatterns: ['/node_modules/']
};
```

### Test Tagging Format

Each property-based test must include a comment with the following format:

```javascript
// Feature: todo-list-life-dashboard, Property 1: Time format conversion
// For any valid time in 24-hour format, converting to 12-hour format and back should produce the original time.
```

### Test Coverage Matrix

| Requirement | Unit Tests | Property Tests |
|-------------|------------|----------------|
| Time/Date Display | ✓ | ✓ |
| Time-Based Greeting | ✓ | ✓ |
| Task Management | ✓ | ✓ |
| Task Persistence | ✓ | ✓ |
| Task Sorting | ✓ | ✓ |
| Focus Timer | ✓ | ✓ |
| Quick Links | ✓ | ✓ |
| Theme Switching | ✓ | ✓ |
| Performance | ✓ | ✓ |
| Browser Support | ✓ | - |

### Test Examples

```javascript
// Example: Task addition property test
// Feature: todo-list-life-dashboard, Property 6: Task addition increases list size
// For any task list and valid (non-empty) task text, adding the task should increase the list size by one.

it('task addition increases list size', () => {
  fc.assert(
    fc.property(
      fc.array(fc.string()), // Generate random task list
      fc.string({ minLength: 1 }), // Generate non-empty task text
      (existingTasks, newText) => {
        const manager = new TaskManager();
        manager.tasks = existingTasks;
        const initialSize = manager.tasks.length;
        manager.addTask(newText);
        expect(manager.tasks.length).toBe(initialSize + 1);
      }
    ),
    { numRuns: 100 }
  );
});
```

## User Interface Wireframes

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Theme Toggle]                    [User Settings]          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     ┌─────────────────────────────────────────────────┐     │
│     │  Greeting Component                              │     │
│     │  ┌─────────────────────────────────────────────┐ │     │
│     │  │  [Time]  [Date]                             │ │     │
│     │  │  Good Morning, [User]                       │ │     │
│     │  └─────────────────────────────────────────────┘ │     │
│     └─────────────────────────────────────────────────┘     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │  Task Manager       │  │  Focus Timer                │  │
│  │                     │  │                             │  │
│  │  [Task Input]       │  │  ┌─────────────────────┐    │  │
│  │                     │  │  │      25:00          │    │  │
│  │  ┌────────────────┐ │  │  └─────────────────────┘    │  │
│  │  │ ✓ Task 1       │ │  │  [Start] [Stop] [Reset]     │  │
│  │  │ ✗ Task 2       │ │  │                             │  │
│  │  │ ✓ Task 3       │ │  │  [Duration: 25 min]         │  │
│  │  └────────────────┘ │  │                             │  │
│  │                     │  └─────────────────────────────┘  │
│  └─────────────────────┘                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │  Quick Links        │  │  Theme Settings             │  │
│  │                     │  │                             │  │
│  │  [GitHub] [Gmail]   │  │  [Light] [Dark] ✓           │  │
│  │  [Stack Overflow]   │  │                             │  │
│  │  [YouTube]          │  │  [Time Format: 24h]         │  │
│  │                     │  │                             │  │
│  │  [Add Link]         │  └─────────────────────────────┘  │
│  └─────────────────────┘                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Details

#### Greeting Component

- **Time Display**: 12-hour or 24-hour format based on user preference
- **Date Display**: Day of week, month, day (e.g., "Monday, January 15")
- **Greeting**: Contextual based on time of day
- **User Name**: Optional, from settings

#### Task Manager

- **Task Input**: Text input with add button
- **Task List**: Scrollable list of tasks
- **Task Item**: Checkbox, text, edit button, delete button
- **Sort Controls**: Dropdown for sort options
- **Empty State**: Message when no tasks exist

#### Focus Timer

- **Timer Display**: MM:SS format
- **Controls**: Start, Stop, Reset buttons
- **Duration Settings**: Input for custom duration
- **Progress Bar**: Visual indication of time remaining

#### Quick Links Manager

- **Link Display**: Button-style links with labels
- **Add Link**: Input for URL and label
- **Link Actions**: Open in new tab, delete

#### Theme Toggle

- **Light/Dark Switch**: Toggle button or switch
- **Time Format**: 12-hour/24-hour toggle
- **User Name**: Optional name input
