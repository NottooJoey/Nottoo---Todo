import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { colors, typography, spacing, borderRadius, shadows } from '../design-system/theme';

interface ListItemProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
  iconBackgroundColor?: string;
  onPress: () => void;
  isSelected?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  count,
  icon,
  iconBackgroundColor = colors.secondary,
  onPress,
  isSelected = false,
  isFirst = false,
  isLast = false,
}) => {
  const isCompleted = title === 'Completed';
  
  const containerStyle = [
    styles.container,
    isCompleted ? styles.completedContainer : null,
    !isCompleted && isFirst && styles.firstItem,
    !isCompleted && isLast && styles.lastItem,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {!isCompleted && !isFirst && (
        <View style={styles.borderTop} />
      )}
      <View style={styles.innerContainer}>
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 48,
    borderRadius: 0,
  },
  completedContainer: {
    borderRadius: 10,
    ...shadows.none,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 12,
    paddingRight: 14,
  },
  firstItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastItem: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
});

export default ListItem; 