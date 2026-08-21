import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AppText } from './AppText';

interface AppInputProps extends TextInputProps {
  label ? : string;
  error ? : string;
}

export const AppInput: React.FC < AppInputProps > = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <AppText variant="sm" color="secondary" style={styles.label}>
          {label}
        </AppText>
      )}
      <TextInput
        placeholderTextColor={colors.text.muted}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error && (
        <AppText variant="xs" color="error" style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  errorText: {
    marginTop: spacing.xs,
  },
});