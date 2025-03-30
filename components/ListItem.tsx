import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRightIcon } from './icons';
import { colors, typography, spacing, borderRadius } from '../design-system/theme';

interface ListItemProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
  iconBackgroundColor?: string;
  onPress: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  count,
  icon,
  iconBackgroundColor = colors.secondary,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon ? (
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: iconBackgroundColor },
            ]}
          >
            {icon}
          </View>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{count}</Text>
      </View>
      <ChevronRightIcon />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
    marginRight: spacing.sm,
  },
  count: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
});

export default ListItem; 