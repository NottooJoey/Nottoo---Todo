import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../design-system/theme';

export interface TodoItemProps {
  id: string;
  title: string;
  listName?: string;
  listColor?: string;
  completed?: boolean;
  hasNote?: boolean;
  onToggle?: (id: string) => void;
  onPress?: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  listName,
  listColor = colors.secondary,
  completed = false,
  hasNote = false,
  onToggle,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(id)}
      activeOpacity={0.7}
    >
      <View style={styles.todoInfo}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onToggle?.(id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {completed ? (
            <Feather name="check-circle" size={20} color="#000" />
          ) : (
            <View style={styles.checkboxOutline} />
          )}
        </TouchableOpacity>
        
        <View style={styles.todoDetails}>
          <View style={styles.todoNameContainer}>
            <Text 
              style={[
                styles.todoName,
                completed && styles.todoNameCompleted
              ]} 
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
          
          {listName && (
            <View style={styles.listTagContainer}>
              <View 
                style={[
                  styles.listTag,
                  { backgroundColor: listColor }
                ]}
              >
                <Text style={styles.listTagText}>
                  {listName}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      
      {hasNote && (
        <View style={styles.noteIconContainer}>
          <Feather name="file-text" size={18} color="rgba(0, 0, 0, 0.6)" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingLeft: 2,
    paddingRight: 4,
    width: '100%',
  },
  todoInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4, // Adjusted to better align with text
  },
  checkboxOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.67,
    borderColor: colors.text,
  },
  todoDetails: {
    flexDirection: 'column',
    gap: 6,
    flex: 1,
    paddingTop: 2, // Added to prevent text clipping
  },
  todoNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20, // Ensure consistent height
  },
  todoName: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 14 * 1.2, // Adjusted line height for better text rendering
  },
  todoNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  listTagContainer: {
    paddingHorizontal: 2,
  },
  listTag: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  listTagText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 12,
  },
  noteIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4, // Adjusted to match checkbox alignment
  },
});

export default TodoItem; 