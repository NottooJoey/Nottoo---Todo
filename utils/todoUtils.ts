// Utility functions for todo operations

// Todo item type definition
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create a new todo item
export const createTodo = (title: string): Todo => {
  return {
    id: generateId(),
    title,
    completed: false,
    createdAt: new Date(),
  };
};

// Toggle todo completion status
export const toggleTodo = (todos: Todo[], id: string): Todo[] => {
  return todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
};

// Delete a todo item
export const deleteTodo = (todos: Todo[], id: string): Todo[] => {
  return todos.filter((todo) => todo.id !== id);
};

// Filter todos by completion status
export const filterTodos = (
  todos: Todo[],
  filter: 'all' | 'active' | 'completed'
): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

// Sort todos by creation date (newest first)
export const sortTodosByDate = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}; 