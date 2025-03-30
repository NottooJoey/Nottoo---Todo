import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../design-system/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`${type}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${type}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'primary' ? colors.background : colors.primary} 
          size="small" 
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  mediumButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  largeButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
  },
  primaryText: {
    color: colors.background,
  },
  secondaryText: {
    color: colors.primary,
  },
  tertiaryText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: typography.fontSizes.xs,
  },
  mediumText: {
    fontSize: typography.fontSizes.sm,
  },
  largeText: {
    fontSize: typography.fontSizes.md,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button; 