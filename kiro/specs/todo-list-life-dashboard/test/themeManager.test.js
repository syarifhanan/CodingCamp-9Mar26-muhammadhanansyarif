// ThemeManager Property Tests
// Feature: todo-list-life-dashboard, Property 28: Theme availability
// Feature: todo-list-life-dashboard, Property 29: Theme application
// Feature: todo-list-life-dashboard, Property 30: Theme persistence
// Feature: todo-list-life-dashboard, Property 31: Theme restoration
// Feature: todo-list-life-dashboard, Property 32: Default theme

describe('ThemeManager', function() {
  let themeManager;

  beforeEach(function() {
    // Clear localStorage before each test
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    themeManager = new ThemeManager();
  });

  // Property 28: Theme availability
  it('should support both light and dark themes', function() {
    expect(() => {
      themeManager.setTheme('light');
    }).to.not.throw();
    
    expect(() => {
      themeManager.setTheme('dark');
    }).to.not.throw();
  });

  it('should throw error for invalid theme', function() {
    expect(() => {
      themeManager.setTheme('invalid');
    }).to.throw('Invalid theme. Must be "light" or "dark".');
  });

  // Property 29: Theme application
  it('should apply theme by setting data-theme attribute', function() {
    themeManager.setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).to.equal('dark');
    
    themeManager.setTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).to.equal('light');
  });

  // Property 30: Theme persistence
  it('should save theme preference to localStorage', function() {
    themeManager.setTheme('dark');
    
    const savedData = localStorage.getItem('todo.theme');
    expect(savedData).to.be.a('string');
    
    const parsed = JSON.parse(savedData);
    expect(parsed.theme).to.equal('dark');
  });

  // Property 31: Theme restoration
  it('should restore theme from localStorage', function() {
    themeManager.setTheme('dark');
    
    // Create new instance
    const newManager = new ThemeManager();
    expect(newManager.currentTheme).to.equal('dark');
    expect(document.documentElement.getAttribute('data-theme')).to.equal('dark');
  });

  // Property 32: Default theme
  it('should default to light theme when no preference saved', function() {
    // Ensure localStorage is empty
    localStorage.clear();
    
    const manager = new ThemeManager();
    expect(manager.currentTheme).to.equal('light');
    expect(document.documentElement.getAttribute('data-theme')).to.equal('light');
  });

  it('should handle missing theme preference', function() {
    // Save incomplete data
    localStorage.setItem('todo.theme', JSON.stringify({}));
    
    const manager = new ThemeManager();
    expect(manager.currentTheme).to.equal('light');
  });

  describe('toggleTheme', function() {
    it('should switch between light and dark', function() {
      themeManager.setTheme('light');
      themeManager.toggleTheme();
      expect(themeManager.currentTheme).to.equal('dark');
      
      themeManager.toggleTheme();
      expect(themeManager.currentTheme).to.equal('light');
    });
  });
});
