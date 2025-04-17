import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DotsIcon } from './icons';
import { colors, typography, spacing } from '../design-system/theme';

interface SectionHeaderProps {
  title: string;
  onMorePress?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onMorePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {onMorePress && (
        <TouchableOpacity onPress={onMorePress} style={styles.moreButton}>
          <DotsIcon size={20} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  title: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSizes.xxl,
    fontWeight: '500',
    color: colors.text,
    lineHeight: typography.fontSizes.xxl,
  },
  moreButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    aspectRatio: 1,
  },
});

export default SectionHeader; 