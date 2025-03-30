import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AddIcon } from './icons';
import { colors, typography, spacing, borderRadius } from '../design-system/theme';

interface NewTodoButtonProps {
  onPress: () => void;
}

const NewTodoButton: React.FC<NewTodoButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <AddIcon color={colors.background} />
      <Text style={styles.text}>New Todos</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg + spacing.sm,
    gap: spacing.sm,
  },
  text: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    color: colors.background,
  },
});

export default NewTodoButton; 