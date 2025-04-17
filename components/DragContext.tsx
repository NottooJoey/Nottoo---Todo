import React, { createContext, useContext, useState } from 'react';
import { Todo } from '../context/TodoContext';

interface DragContextType {
  draggedTodo: Todo | null;
  setDraggedTodo: (todo: Todo | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const DragContext = createContext<DragContextType>({
  draggedTodo: null,
  setDraggedTodo: () => {},
  isDragging: false,
  setIsDragging: () => {},
});

export const DragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragContext.Provider
      value={{
        draggedTodo,
        setDraggedTodo,
        isDragging,
        setIsDragging,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};

export const useDrag = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
}; 