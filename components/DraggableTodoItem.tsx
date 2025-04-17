import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useDrag } from './DragContext';
import { Todo } from '../context/TodoContext';
import TodoItem from './TodoItem';

interface DraggableTodoItemProps {
  todo: Todo;
  onPress: (todo: Todo) => void;
  onLongPress?: () => void;
}

const DraggableTodoItem: React.FC<DraggableTodoItemProps> = ({
  todo,
  onPress,
  onLongPress,
}) => {
  const { setDraggedTodo, setIsDragging } = useDrag();
  const translateY = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeState === 5) {
      // State.ACTIVE
      setIsDragging(true);
      setDraggedTodo(todo);
    } else if (event.nativeState === 1 || event.nativeState === 3) {
      // State.CANCELLED or State.END
      setIsDragging(false);
      setDraggedTodo(null);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 2,
      }).start();
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <TodoItem
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          hasNote={!!todo.notes}
          listName={todo.listName}
          onPress={() => onPress(todo)}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default DraggableTodoItem; 