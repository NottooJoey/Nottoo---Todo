import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../design-system/theme';

interface MoveBarProps {
  width?: number;
  barHeight?: number;
}

const MoveBar: React.FC<MoveBarProps> = ({ width = 36, barHeight = 4 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <View style={[styles.bar, { width, height: barHeight }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    height: 20,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  bar: {
    backgroundColor: colors.divider,
    borderRadius: borderRadius.round,
  },
});

export default MoveBar; 