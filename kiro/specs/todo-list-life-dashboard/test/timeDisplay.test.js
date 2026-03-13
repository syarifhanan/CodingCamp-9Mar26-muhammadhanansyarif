// TimeDisplay Property Tests
// Feature: todo-list-life-dashboard, Property 1: Time format conversion
// Feature: todo-list-life-dashboard, Property 2: Date formatting completeness
// Feature: todo-list-life-dashboard, Property 3: Time update frequency

describe('TimeDisplay', function() {
  let timeDisplay;

  beforeEach(function() {
    // Create a mock element
    const mockElement = document.createElement('span');
    mockElement.id = 'current-time';
    document.body.appendChild(mockElement);
    timeDisplay = new TimeDisplay('current-time');
  });

  afterEach(function() {
    if (timeDisplay.updateInterval) {
      clearInterval(timeDisplay.updateInterval);
    }
    document.getElementById('current-time').remove();
  });

  // Property 1: Time format conversion
  describe('formatTime', function() {
    it('should convert 24-hour to 12-hour format correctly', function() {
      const testCases = [
        { hour: 0, expected: '12:00:00 AM' },
        { hour: 1, expected: '01:00:00 AM' },
        { hour: 11, expected: '11:00:00 AM' },
        { hour: 12, expected: '12:00:00 PM' },
        { hour: 13, expected: '01:00:00 PM' },
        { hour: 23, expected: '11:00:00 PM' }
      ];

      testCases.forEach(({ hour, expected }) => {
        const date = new Date();
        date.setHours(hour, 0, 0, 0);
        const result = timeDisplay.formatTime(date, false);
        expect(result).to.equal(expected);
      });
    });

    it('should handle 24-hour format correctly', function() {
      const testCases = [
        { hour: 0, expected: '00:00:00' },
        { hour: 9, expected: '09:00:00' },
        { hour: 12, expected: '12:00:00' },
        { hour: 23, expected: '23:00:00' }
      ];

      testCases.forEach(({ hour, expected }) => {
        const date = new Date();
        date.setHours(hour, 0, 0, 0);
        const result = timeDisplay.formatTime(date, true);
        expect(result).to.equal(expected);
      });
    });

    it('should be reversible: 24h -> 12h -> 24h', function() {
      const hours = [0, 6, 12, 18, 23];
      
      hours.forEach(hour => {
        const date = new Date();
        date.setHours(hour, 30, 45, 0);
        
        const time12 = timeDisplay.formatTime(date, false);
        const time24 = timeDisplay.formatTime(date, true);
        
        // Verify the format is correct
        expect(time12).to.match(/\d{1,2}:\d{2}:\d{2} (AM|PM)/);
        expect(time24).to.match(/\d{2}:\d{2}:\d{2}/);
      });
    });
  });

  // Property 2: Date formatting completeness
  describe('formatDate', function() {
    it('should include day of week, month, and day', function() {
      const date = new Date(2024, 0, 15); // January 15, 2024 (Monday)
      const result = timeDisplay.formatDate(date);
      
      expect(result).to.include('Monday');
      expect(result).to.include('January');
      expect(result).to.include('15');
    });

    it('should handle different dates correctly', function() {
      const testCases = [
        { date: new Date(2024, 0, 1), expectedDay: 'Sunday', expectedMonth: 'January' },
        { date: new Date(2024, 1, 29), expectedDay: 'Thursday', expectedMonth: 'February' },
        { date: new Date(2024, 11, 31), expectedDay: 'Tuesday', expectedMonth: 'December' }
      ];

      testCases.forEach(({ date, expectedDay, expectedMonth }) => {
        const result = timeDisplay.formatDate(date);
        expect(result).to.include(expectedDay);
        expect(result).to.include(expectedMonth);
      });
    });
  });

  // Property 3: Time update frequency
  describe('updateTime', function() {
    it('should update the displayed time', function() {
      const initialTime = timeDisplay.currentTime;
      timeDisplay.updateTime();
      const updatedTime = timeDisplay.currentTime;
      
      // Time should be updated (at least 1ms difference)
      expect(updatedTime.getTime()).to.be.gte(initialTime.getTime());
    });

    it('should update every second when running', function(done) {
      timeDisplay.start();
      
      const initialTime = timeDisplay.currentTime;
      
      setTimeout(() => {
        const updatedTime = timeDisplay.currentTime;
        const diff = updatedTime.getTime() - initialTime.getTime();
        
        // Should be approximately 1000ms (allowing some tolerance)
        expect(diff).to.be.within(900, 1100);
        
        timeDisplay.stop();
        done();
      }, 1100);
    });
  });
});
