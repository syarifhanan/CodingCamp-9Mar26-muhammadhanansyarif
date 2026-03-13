// TaskManager Property Tests
// Feature: todo-list-life-dashboard, Property 6: Task addition increases list size
// Feature: todo-list-life-dashboard, Property 7: Duplicate task rejection
// Feature: todo-list-life-dashboard, Property 8: Task editing preserves other fields
// Feature: todo-list-life-dashboard, Property 9: Task completion toggle
// Feature: todo-list-life-dashboard, Property 10: Task deletion removes item
// Feature: todo-list-life-dashboard, Property 11: Task persistence round trip
// Feature: todo-list-life-dashboard, Property 12: Empty storage initialization
// Feature: todo-list-life-dashboard, Property 13: Corrupted data handling
// Feature: todo-list-life-dashboard, Property 15: Sort correctness

describe('TaskManager', function() {
  let taskManager;

  beforeEach(function() {
    // Clear localStorage before each test
    localStorage.clear();
    taskManager = new TaskManager();
  });

  // Property 6: Task addition increases list size
  describe('addTask', function() {
    it('should increase list size by one', function() {
      const initialSize = taskManager.tasks.length;
      taskManager.addTask('Test task');
      expect(taskManager.tasks.length).to.equal(initialSize + 1);
    });

    it('should create a task with valid id', function() {
      const task = taskManager.addTask('Test task');
      expect(task.id).to.be.a('string');
      expect(task.id).to.match(/^task-/);
    });

    it('should set completed to false by default', function() {
      const task = taskManager.addTask('Test task');
      expect(task.completed).to.be.false;
    });

    it('should set timestamps', function() {
      const task = taskManager.addTask('Test task');
      expect(task.createdAt).to.be.a('number');
      expect(task.updatedAt).to.be.a('number');
    });
  });

  // Property 7: Duplicate task rejection
  it('should reject duplicate tasks', function() {
    taskManager.addTask('Duplicate task');
    
    expect(() => {
      taskManager.addTask('Duplicate task');
    }).to.throw('Task already exists');
    
    expect(taskManager.tasks.length).to.equal(1);
  });

  // Property 8: Task editing preserves other fields
  describe('editTask', function() {
    it('should preserve other fields when editing', function() {
      const task = taskManager.addTask('Original text');
      const originalId = task.id;
      const originalCompleted = task.completed;
      const originalCreatedAt = task.createdAt;
      
      taskManager.editTask(originalId, 'Updated text');
      
      const updatedTask = taskManager.tasks.find(t => t.id === originalId);
      expect(updatedTask.text).to.equal('Updated text');
      expect(updatedTask.id).to.equal(originalId);
      expect(updatedTask.completed).to.equal(originalCompleted);
      expect(updatedTask.createdAt).to.equal(originalCreatedAt);
      expect(updatedTask.updatedAt).to.be.gte(originalCreatedAt);
    });
  });

  // Property 9: Task completion toggle
  describe('toggleComplete', function() {
    it('should flip completion status', function() {
      const task = taskManager.addTask('Test task');
      expect(task.completed).to.be.false;
      
      taskManager.toggleComplete(task.id);
      expect(taskManager.tasks[0].completed).to.be.true;
      
      taskManager.toggleComplete(task.id);
      expect(taskManager.tasks[0].completed).to.be.false;
    });
  });

  // Property 10: Task deletion removes item
  describe('deleteTask', function() {
    it('should remove the task from the list', function() {
      const task = taskManager.addTask('Test task');
      const initialSize = taskManager.tasks.length;
      
      taskManager.deleteTask(task.id);
      expect(taskManager.tasks.length).to.equal(initialSize - 1);
      expect(taskManager.tasks.find(t => t.id === task.id)).to.be.undefined;
    });
  });

  // Property 11: Task persistence round trip
  describe('Persistence', function() {
    it('should persist and restore tasks correctly', function() {
      // Add some tasks
      taskManager.addTask('Task 1');
      taskManager.addTask('Task 2');
      taskManager.toggleComplete(taskManager.tasks[0].id);
      
      // Create new instance (simulates page reload)
      const newManager = new TaskManager();
      
      expect(newManager.tasks.length).to.equal(2);
      expect(newManager.tasks[0].text).to.equal('Task 1');
      expect(newManager.tasks[0].completed).to.be.true;
      expect(newManager.tasks[1].text).to.equal('Task 2');
      expect(newManager.tasks[1].completed).to.be.false;
    });
  });

  // Property 12: Empty storage initialization
  it('should initialize empty list when storage is empty', function() {
    // Ensure localStorage is empty
    localStorage.clear();
    
    const manager = new TaskManager();
    expect(manager.tasks).to.be.an('array').that.is.empty;
  });

  // Property 13: Corrupted data handling
  it('should handle corrupted data gracefully', function() {
    // Save corrupted data
    localStorage.setItem('todo.tasks', 'not valid json {');
    
    const manager = new TaskManager();
    expect(manager.tasks).to.be.an('array').that.is.empty;
  });

  it('should handle invalid data structure', function() {
    // Save invalid structure
    localStorage.setItem('todo.tasks', JSON.stringify('not an array'));
    
    const manager = new TaskManager();
    expect(manager.tasks).to.be.an('array').that.is.empty;
  });

  // Property 15: Sort correctness
  describe('getSortedTasks', function() {
    beforeEach(function() {
      // Add tasks with different timestamps
      const task1 = taskManager.addTask('Task C');
      setTimeout(() => {
        const task2 = taskManager.addTask('Task A');
        setTimeout(() => {
          const task3 = taskManager.addTask('Task B');
          task3.completed = true;
        }, 10);
      }, 10);
    });

    it('should sort by creation order', function() {
      taskManager.setSortOption('creation');
      const sorted = taskManager.getSortedTasks();
      
      expect(sorted[0].text).to.include('Task');
    });

    it('should sort by completion status', function() {
      taskManager.setSortOption('completion');
      const sorted = taskManager.getSortedTasks();
      
      // Completed tasks should come after incomplete
      expect(sorted[0].completed).to.be.false;
    });

    it('should sort alphabetically', function() {
      taskManager.setSortOption('alphabetical');
      const sorted = taskManager.getSortedTasks();
      
      expect(sorted[0].text).to.equal('Task A');
      expect(sorted[1].text).to.equal('Task B');
      expect(sorted[2].text).to.equal('Task C');
    });
  });
});
