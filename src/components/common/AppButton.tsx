import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { AppText } from './AppText';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant ? : 'primary' | 'secondary' | 'outline';
  loading ? : boolean;
  disabled ? : boolean;
  style ? : ViewStyle;
}

export const AppButton: React.FC < AppButtonProps > = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        isPrimary && styles.primaryBg,
        variant === 'secondary' && styles.secondaryBg,
        isOutline && styles.outlineBg,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.accent.primary : colors.text.primary} />
      ) : (
        <AppText
          variant="md"
          weight="bold"
          color={isOutline ? 'primary' : 'primary'}
        >
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryBg: {
    backgroundColor: colors.accent.primary,
  },
  secondaryBg: {
    backgroundColor: colors.background.tertiary,
  },
  outlineBg: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  disabled: {
    opacity: 0.5,
  },
});