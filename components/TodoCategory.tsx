import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../design-system/theme';

export interface TodoCategoryProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onPress?: (id: string) => void;
}

const TodoCategory: React.FC<TodoCategoryProps> = ({
  id,
  title,
  children,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.titleContainer}
          onPress={() => onPress && onPress(id)}
        >
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dragHandle}>
          <View style={styles.handleDot} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.childrenContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  titleContainer: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
  dragHandle: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
  },
  handleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  childrenContainer: {
    paddingTop: spacing.xs,
  },
});

export default TodoCategory; 