// GreetingService Property Tests
// Feature: todo-list-life-dashboard, Property 4: Time-based greeting selection
// Feature: todo-list-life-dashboard, Property 5: Custom name inclusion

describe('GreetingService', function() {
  let greetingService;

  beforeEach(function() {
    greetingService = new GreetingService();
  });

  // Property 4: Time-based greeting selection
  describe('getGreeting', function() {
    it('should return morning greeting for 5AM-12PM', function() {
      const morningHours = [5, 6, 9, 11];
      
      morningHours.forEach(hour => {
        const date = new Date();
        date.setHours(hour, 30, 0, 0);
        const greeting = greetingService.getGreeting(date);
        expect(greeting).to.equal('Good Morning');
      });
    });

    it('should return afternoon greeting for 12PM-5PM', function() {
      const afternoonHours = [12, 13, 15, 16];
      
      afternoonHours.forEach(hour => {
        const date = new Date();
        date.setHours(hour, 30, 0, 0);
        const greeting = greetingService.getGreeting(date);
        expect(greeting).to.equal('Good Afternoon');
      });
    });

    it('should return evening greeting for 5PM-9PM', function() {
      const eveningHours = [17, 18, 20];
      
      eveningHours.forEach(hour => {
        const date = new Date();
        date.setHours(hour, 30, 0, 0);
        const greeting = greetingService.getGreeting(date);
        expect(greeting).to.equal('Good Evening');
      });
    });

    it('should return night greeting for 9PM-5AM', function() {
      const nightHours = [21, 22, 23, 0, 1, 4];
      
      nightHours.forEach(hour => {
        const date = new Date();
        date.setHours(hour, 30, 0, 0);
        const greeting = greetingService.getGreeting(date);
        expect(greeting).to.equal('Good Night');
      });
    });

    it('should handle boundary hours correctly', function() {
      // 12PM should be afternoon
      const noon = new Date();
      noon.setHours(12, 0, 0, 0);
      expect(greetingService.getGreeting(noon)).to.equal('Good Afternoon');
      
      // 5PM should be evening
      const fivePM = new Date();
      fivePM.setHours(17, 0, 0, 0);
      expect(greetingService.getGreeting(fivePM)).to.equal('Good Evening');
      
      // 9PM should be night
      const ninePM = new Date();
      ninePM.setHours(21, 0, 0, 0);
      expect(greetingService.getGreeting(ninePM)).to.equal('Good Night');
    });
  });

  // Property 5: Custom name inclusion
  describe('getGreetingWithUserName', function() {
    it('should include custom name when configured', function() {
      greetingService.setUserName('John');
      
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      const greeting = greetingService.getGreetingWithUserName(date);
      
      expect(greeting).to.include('Good Morning');
      expect(greeting).to.include('John');
    });

    it('should work without custom name', function() {
      // Ensure no name is set
      greetingService.setUserName('');
      
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      const greeting = greetingService.getGreetingWithUserName(date);
      
      expect(greeting).to.equal('Good Morning!');
    });

    it('should persist name across calls', function() {
      greetingService.setUserName('Alice');
      
      const date = new Date();
      date.setHours(14, 0, 0, 0);
      const greeting1 = greetingService.getGreetingWithUserName(date);
      
      // Create new instance
      const newService = new GreetingService();
      const greeting2 = newService.getGreetingWithUserName(date);
      
      expect(greeting1).to.include('Alice');
      expect(greeting2).to.include('Alice');
    });
  });

  describe('getUserName', function() {
    it('should return empty string when no name is set', function() {
      // Clear any existing settings
      localStorage.removeItem('todo.settings');
      
      const name = greetingService.getUserName();
      expect(name).to.equal('');
    });

    it('should return saved name from localStorage', function() {
      localStorage.setItem('todo.settings', JSON.stringify({
        userName: 'TestUser',
        timeFormat: '24',
        savedAt: Date.now()
      }));
      
      const name = greetingService.getUserName();
      expect(name).to.equal('TestUser');
    });
  });
});
