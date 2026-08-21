import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { AppText } from '../common/AppText';

interface OnboardingCardProps {
  icon: string;
  title: string;
  description: string;
}

export const OnboardingCard: React.FC < OnboardingCardProps > = ({
  icon,
  title,
  description,
}) => {
  return (
    <View style={styles.card}>
      <AppText variant="2xl" style={styles.icon}>
        {icon}
      </AppText>
      <AppText variant="lg" weight="bold" color="primary" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="sm" color="secondary" style={styles.description}>
        {description}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
  },
});