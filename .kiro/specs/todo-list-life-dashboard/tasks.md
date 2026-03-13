# Implementation Plan: To-Do List Life Dashboard

## Overview

This dashboard is a client-side web application built with HTML, CSS, and vanilla JavaScript. The implementation follows a component-based architecture with Local Storage for data persistence. Each component manages its own state and persists changes to Local Storage.

## Tasks

- [x] 1. Set up project structure and core files
  - Create `index.html` with semantic HTML structure
  - Create `styles.css` with CSS variables for light/dark themes
  - Create `app.js` as the main entry point
  - Set up Local Storage keys for all data types
  - _Requirements: 9.1, 9.2, 10.1, 10.2_

- [ ] 2. Implement GreetingComponent
  - [ ] 2.1 Create TimeDisplay class
    - Implement `updateTime()` method to refresh displayed time
    - Implement `formatTime(date, use24Hour)` for 12/24 hour conversion
    - Implement `formatDate(date)` for date display
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 2.2 Write property test for time format conversion
    - **Property 1: Time format conversion**
    - **Validates: Requirements 1.1**
  
  - [ ] 2.3 Write property test for date formatting
    - **Property 2: Date formatting completeness**
    - **Validates: Requirements 1.2**
  
  - [ ] 2.4 Write property test for time update frequency
    - **Property 3: Time update frequency**
    - **Validates: Requirements 1.3**
  
  - [ ] 2.2 Create GreetingService class
    - Implement `getGreeting(time)` for time-based greeting selection
    - Implement `getUserName()` to retrieve from Local Storage
    - Handle 4 time periods: morning (5AM-12PM), afternoon (12PM-5PM), evening (5PM-9PM), night (9PM-5AM)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 2.5 Write property test for time-based greeting selection
    - **Property 4: Time-based greeting selection**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
  
  - [ ] 2.6 Write property test for custom name inclusion
    - **Property 5: Custom name inclusion**
    - **Validates: Requirements 2.5**

- [ ] 3. Implement TaskManager
  - [ ] 3.1 Create Task class with validation
    - Implement id generation (UUID)
    - Implement text validation (non-empty, no duplicates)
    - Implement timestamps (createdAt, updatedAt)
    - _Requirements: 3.1, 3.2_
  
  - [ ] 3.2 Write property test for task addition
    - **Property 6: Task addition increases list size**
    - **Validates: Requirements 3.1**
  
  - [ ] 3.3 Write property test for duplicate rejection
    - **Property 7: Duplicate task rejection**
    - **Validates: Requirements 3.2**
  
  - [ ] 3.2 Create TaskManager class
    - Implement `addTask(text)` with validation
    - Implement `editTask(id, newText)` preserving other fields
    - Implement `toggleComplete(id)` to flip completion status
    - Implement `deleteTask(id)` to remove tasks
    - Implement `setSortOption(option)` for sorting configuration
    - Implement `getSortedTasks()` with three sort options
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 5.1, 5.2_
  
  - [ ] 3.4 Write property test for task editing
    - **Property 8: Task editing preserves other fields**
    - **Validates: Requirements 3.3**
  
  - [ ] 3.5 Write property test for task completion toggle
    - **Property 9: Task completion toggle**
    - **Validates: Requirements 3.4, 3.5**
  
  - [ ] 3.6 Write property test for task deletion
    - **Property 10: Task deletion removes item**
    - **Validates: Requirements 3.6**
  
  - [ ] 3.3 Create PersistenceService for TaskManager
    - Implement `save(tasks)` to persist to Local Storage
    - Implement `load()` to restore from Local Storage
    - Implement error handling for corrupted data
    - _Requirements: 3.7, 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 3.7 Write property test for task persistence round trip
    - **Property 11: Task persistence round trip**
    - **Validates: Requirements 3.7, 4.4**
  
  - [ ] 3.8 Write property test for empty storage initialization
    - **Property 12: Empty storage initialization**
    - **Validates: Requirements 4.2**
  
  - [ ] 3.9 Write property test for corrupted data handling
    - **Property 13: Corrupted data handling**
    - **Validates: Requirements 4.3**
  
  - [ ] 3.4 Create SortService
    - Implement `sortByCreation(tasks)` for creation order
    - Implement `sortByCompletion(tasks)` for completion status
    - Implement `sortByAlphabetical(tasks)` for alphabetical order
    - _Requirements: 5.1, 5.2_
  
  - [ ] 3.10 Write property test for sort correctness
    - **Property 15: Sort correctness**
    - **Validates: Requirements 5.2**

- [ ] 4. Implement FocusTimer
  - [ ] 4.1 Create Timer class
    - Implement `start()` to begin countdown
    - Implement `stop()` to pause countdown
    - Implement `reset()` to restore to full duration
    - Implement `setDuration(minutes)` for custom duration
    - Implement `tick()` for countdown updates
    - Default duration: 25 minutes (1500 seconds)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [ ] 4.2 Write property test for timer default duration
    - **Property 16: Timer default duration**
    - **Validates: Requirements 6.1**
  
  - [ ] 4.3 Write property test for timer countdown accuracy
    - **Property 17: Timer countdown accuracy**
    - **Validates: Requirements 6.2**
  
  - [ ] 4.4 Write property test for timer completion notification
    - **Property 18: Timer completion notification**
    - **Validates: Requirements 6.3**
  
  - [ ] 4.5 Write property test for timer pause and resume
    - **Property 19: Timer pause and resume**
    - **Validates: Requirements 6.4**
  
  - [ ] 4.6 Write property test for timer reset
    - **Property 20: Timer reset**
    - **Validates: Requirements 6.5**
  
  - [ ] 4.7 Write property test for timer update frequency
    - **Property 21: Timer update frequency**
    - **Validates: Requirements 6.6**
  
  - [ ] 4.8 Write property test for custom timer duration
    - **Property 22: Custom timer duration**
    - **Validates: Requirements 6.7**
  
  - [ ] 4.2 Create TimerPersistenceService
    - Implement `save(timerState)` to persist timer state
    - Implement `load()` to restore timer state
    - Handle timer recovery after page reload
    - _Requirements: 6.2, 6.4_

- [ ] 5. Implement QuickLinksManager
  - [ ] 5.1 Create QuickLink class with validation
    - Implement id generation (UUID)
    - Implement URL validation
    - Implement label storage
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ] 5.2 Write property test for quick link addition
    - **Property 23: Quick link addition**
    - **Validates: Requirements 7.1**
  
  - [ ] 5.3 Write property test for quick link opening
    - **Property 24: Quick link opening**
    - **Validates: Requirements 7.2**
  
  - [ ] 5.4 Write property test for quick link deletion
    - **Property 25: Quick link deletion**
    - **Validates: Requirements 7.3**
  
  - [ ] 5.2 Create QuickLinksManager class
    - Implement `addLink(url, label)` with validation
    - Implement `deleteLink(id)` to remove links
    - Implement `openLink(id)` to open in new tab
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ] 5.3 Create PersistenceService for QuickLinksManager
    - Implement `save(links)` to persist to Local Storage
    - Implement `load()` to restore from Local Storage
    - _Requirements: 7.4, 7.5, 7.6_
  
  - [ ] 5.5 Write property test for quick link persistence round trip
    - **Property 26: Quick link persistence round trip**
    - **Validates: Requirements 7.4, 7.6**
  
  - [ ] 5.6 Write property test for quick link loading
    - **Property 27: Quick link loading**
    - **Validates: Requirements 7.5**

- [ ] 6. Implement ThemeManager
  - [ ] 6.1 Create ThemeService
    - Implement `setTheme(theme)` for theme switching
    - Implement `toggleTheme()` for light/dark toggle
    - Implement `applyTheme(theme)` to apply CSS classes
    - Support 'light' and 'dark' themes
    - _Requirements: 8.1, 8.2_
  
  - [ ] 6.2 Write property test for theme availability
    - **Property 28: Theme availability**
    - **Validates: Requirements 8.1**
  
  - [ ] 6.3 Write property test for theme application
    - **Property 29: Theme application**
    - **Validates: Requirements 8.2**
  
  - [ ] 6.2 Create ThemePersistenceService
    - Implement `save(theme)` to persist preference
    - Implement `load()` to restore preference
    - Default to 'light' theme if no preference saved
    - _Requirements: 8.3, 8.4, 8.5_
  
  - [ ] 6.4 Write property test for theme persistence
    - **Property 30: Theme persistence**
    - **Validates: Requirements 8.3**
  
  - [ ] 6.5 Write property test for theme restoration
    - **Property 31: Theme restoration**
    - **Validates: Requirements 8.4**
  
  - [ ] 6.6 Write property test for default theme
    - **Property 32: Default theme**
    - **Validates: Requirements 8.5**

- [ ] 7. Implement UserSettings
  - [ ] 7.1 Create UserSettings class
    - Implement `setUserName(name)` for custom greeting
    - Implement `setTimeFormat(format)` for 12/24 hour toggle
    - Implement `save()` and `load()` methods
    - _Requirements: 2.5, 1.1_

- [ ] 8. Integrate components and wire up UI
  - [ ] 8.1 Create Dashboard class
    - Initialize all components on load
    - Connect event listeners between components
    - Handle component communication
    - _Requirements: 9.1, 9.2_
  
  - [ ] 8.2 Implement event system
    - Create event emitter for component communication
    - Implement timeUpdated, greetingChanged events
    - Implement taskAdded, taskUpdated, taskDeleted events
    - Implement timerStarted, timerStopped, timerComplete events
    - Implement linkAdded, linkDeleted events
    - Implement themeChanged events
    - _Requirements: 9.2_
  
  - [ ] 8.3 Create UI event handlers
    - Connect HTML form submissions to component methods
    - Connect button clicks to component actions
    - Connect input changes to component updates
    - _Requirements: 9.2_
  
  - [ ] 8.4 Write integration tests
    - Test end-to-end user flows
    - Test component interaction
    - Test Local Storage persistence
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All components use Local Storage for persistence
- Theme switching uses CSS variables for efficient updates
- Timer uses `setInterval` with `Date.now()` for accuracy
- All data models use UUID for unique identification
