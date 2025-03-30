import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NoteIcon } from './icons';
import { colors, spacing, typography, borderRadius } from '../design-system/theme';

export interface TodoItemProps {
  id: string;
  title: string;
  listName?: string;
  listColor?: string;
  completed?: boolean;
  hasNote?: boolean;
  onToggle?: (id: string) => void;
  onNotePress?: (id: string) => void;
  onPress?: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  listName,
  listColor,
  completed = false,
  hasNote = false,
  onToggle,
  onNotePress,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress && onPress(id)}
      activeOpacity={0.7}
    >
      <View style={styles.todoInfo}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onToggle && onToggle(id)}
        >
          {completed && (
            <View style={styles.checkmark}>
              {/* Checkmark inside */}
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.todoDetails}>
          <View style={styles.todoNameContainer}>
            <Text style={styles.todoName} numberOfLines={1}>{title}</Text>
          </View>
          
          {listName && (
            <View style={styles.listTagContainer}>
              <View 
                style={[
                  styles.listTag, 
                  { backgroundColor: listColor || colors.secondary }
                ]}
              >
                <Text style={[
                  styles.listTagText, 
                  { color: listColor === '#FFFFFF' ? colors.text : colors.background }
                ]}>
                  {listName}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      
      {hasNote && (
        <TouchableOpacity 
          style={styles.noteButton}
          onPress={() => onNotePress && onNotePress(id)}
        >
          <NoteIcon size={18} color="rgba(0, 0, 0, 0.6)" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    width: '100%',
    borderRadius: borderRadius.md,
  },
  todoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.7,
    borderColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  todoDetails: {
    flexDirection: 'column',
    gap: spacing.xs,
  },
  todoNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  todoName: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
  listTagContainer: {
    flexDirection: 'column',
    paddingHorizontal: spacing.xs,
  },
  listTag: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  listTagText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: '400',
    color: colors.background,
  },
  noteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TodoItem; 