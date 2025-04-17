import React, { createContext, useContext, useReducer } from 'react';

export interface Todo {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  listName: string;
  createdAt: number;
  isCommitted: boolean;
}

export interface List {
  name: string;
  icon: string;
  color: string;
}

interface TodoState {
  todos: Todo[];
  lists: List[];
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'ADD_LIST'; payload: List }
  | { type: 'DELETE_LIST'; payload: string };

const initialState: TodoState = {
  todos: [],
  lists: [
    {
      name: 'Tasks',
      icon: '📝',
      color: '#F97275',
    },
  ],
};

const TodoContext = createContext<{
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case 'ADD_LIST':
      return {
        ...state,
        lists: [...state.lists, action.payload],
      };
    case 'DELETE_LIST':
        return {
          ...state,
        lists: state.lists.filter((list) => list.name !== action.payload),
        todos: state.todos.filter((todo) => todo.listName !== action.payload),
        };
    default:
      return state;
  }
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}; 