import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { colors, typography, spacing, borderRadius, shadows } from '../design-system/theme';

interface ListItemProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
  iconBackgroundColor?: string;
  onPress: () => void;
  isSelected?: boolean;
  isGrouped?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  count,
  icon,
  iconBackgroundColor = colors.secondary,
  onPress,
  isSelected = false,
  isGrouped = false,
}) => {
  const containerStyle = [
    styles.container,
    title === 'Completed' && { ...shadows.none },
    isGrouped && styles.groupedContainer,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
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
            <View style={styles.iconWrapper}>
              {icon}
            </View>
          </View>
        ) : null}
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.count}>
          {count.toString()}
        </Text>
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
    alignSelf: 'stretch',
    paddingVertical: 14,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 48,
    ...shadows.sm,
  },
  groupedContainer: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    ...shadows.none,
  },
  containerSelected: {
    backgroundColor: colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconWrapper: {
    transform: [{ scale: 0.7 }],
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.relaxed,
  },
  titleSelected: {
    color: '#FFFFFF',
  },
  count: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.relaxed,
    marginLeft: 8,
    width: 8,
    textAlign: 'center',
  },
  countSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ListItem; 