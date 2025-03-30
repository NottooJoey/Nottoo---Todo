import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../design-system/theme';

interface MoveBarProps {
  width?: number;
  height?: number;
}

const MoveBar: React.FC<MoveBarProps> = ({ width = 36, height = 5 }) => {
  return (
    <View style={[styles.bar, { width, height }]} />
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.divider,
    borderRadius: borderRadius.round,
  },
});

export default MoveBar; 