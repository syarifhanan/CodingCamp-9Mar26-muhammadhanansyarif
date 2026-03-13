// QuickLinksManager Property Tests
// Feature: todo-list-life-dashboard, Property 23: Quick link addition
// Feature: todo-list-life-dashboard, Property 24: Quick link opening
// Feature: todo-list-life-dashboard, Property 25: Quick link deletion
// Feature: todo-list-life-dashboard, Property 26: Quick link persistence round trip
// Feature: todo-list-life-dashboard, Property 27: Quick link loading

describe('QuickLinksManager', function() {
  let quickLinksManager;

  beforeEach(function() {
    // Clear localStorage before each test
    localStorage.clear();
    quickLinksManager = new QuickLinksManager();
  });

  // Property 23: Quick link addition
  describe('addLink', function() {
    it('should increase list size by one', function() {
      const initialSize = quickLinksManager.links.length;
      quickLinksManager.addLink('https://example.com', 'Example');
      expect(quickLinksManager.links.length).to.equal(initialSize + 1);
    });

    it('should create a link with valid id', function() {
      const link = quickLinksManager.addLink('https://example.com', 'Example');
      expect(link.id).to.be.a('string');
      expect(link.id).to.match(/^link-/);
    });

    it('should use label if provided', function() {
      const link = quickLinksManager.addLink('https://example.com', 'My Example');
      expect(link.label).to.equal('My Example');
    });

    it('should use URL as label if no label provided', function() {
      const link = quickLinksManager.addLink('https://example.com');
      expect(link.label).to.equal('https://example.com');
    });

    it('should validate URL format', function() {
      expect(() => {
        quickLinksManager.addLink('not a valid url', 'Example');
      }).to.throw('Invalid URL');
    });
  });

  // Property 24: Quick link opening
  describe('openLink', function() {
    it('should open link in new tab', function() {
      const link = quickLinksManager.addLink('https://example.com', 'Example');
      
      let openedUrl = null;
      const originalOpen = window.open;
      window.open = function(url) {
        openedUrl = url;
      };
      
      quickLinksManager.openLink(link.id);
      
      expect(openedUrl).to.equal('https://example.com');
      
      window.open = originalOpen;
    });

    it('should throw error for non-existent link', function() {
      expect(() => {
        quickLinksManager.openLink('non-existent-id');
      }).to.throw('Quick link not found');
    });
  });

  // Property 25: Quick link deletion
  describe('deleteLink', function() {
    it('should remove the link from the list', function() {
      const link = quickLinksManager.addLink('https://example.com', 'Example');
      const initialSize = quickLinksManager.links.length;
      
      quickLinksManager.deleteLink(link.id);
      expect(quickLinksManager.links.length).to.equal(initialSize - 1);
      expect(quickLinksManager.links.find(l => l.id === link.id)).to.be.undefined;
    });

    it('should throw error for non-existent link', function() {
      expect(() => {
        quickLinksManager.deleteLink('non-existent-id');
      }).to.throw('Quick link not found');
    });
  });

  // Property 26: Quick link persistence round trip
  describe('Persistence', function() {
    it('should persist and restore links correctly', function() {
      // Add some links
      quickLinksManager.addLink('https://example1.com', 'Example 1');
      quickLinksManager.addLink('https://example2.com', 'Example 2');
      
      // Create new instance (simulates page reload)
      const newManager = new QuickLinksManager();
      
      expect(newManager.links.length).to.equal(2);
      expect(newManager.links[0].url).to.equal('https://example1.com');
      expect(newManager.links[0].label).to.equal('Example 1');
      expect(newManager.links[1].url).to.equal('https://example2.com');
      expect(newManager.links[1].label).to.equal('Example 2');
    });
  });

  // Property 27: Quick link loading
  it('should load links from localStorage', function() {
    // Save links directly to localStorage
    const links = [
      { id: 'link-1', url: 'https://example1.com', label: 'Example 1', createdAt: Date.now() },
      { id: 'link-2', url: 'https://example2.com', label: 'Example 2', createdAt: Date.now() }
    ];
    localStorage.setItem('todo.quickLinks', JSON.stringify(links));
    
    const manager = new QuickLinksManager();
    expect(manager.links.length).to.equal(2);
    expect(manager.links[0].url).to.equal('https://example1.com');
    expect(manager.links[1].url).to.equal('https://example2.com');
  });

  it('should initialize empty list when storage is empty', function() {
    // Ensure localStorage is empty
    localStorage.clear();
    
    const manager = new QuickLinksManager();
    expect(manager.links).to.be.an('array').that.is.empty;
  });

  it('should handle corrupted data gracefully', function() {
    // Save corrupted data
    localStorage.setItem('todo.quickLinks', 'not valid json {');
    
    const manager = new QuickLinksManager();
    expect(manager.links).to.be.an('array').that.is.empty;
  });
});
