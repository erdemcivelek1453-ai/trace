import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { AppText } from '../common/AppText';

interface MemorySourceBadgeProps {
  type: 'photo' | 'calendar' | 'ocr';
  label: string;
}

export const MemorySourceBadge: React.FC < MemorySourceBadgeProps > = ({ type, label }) => {
  const getIcon = () => {
    switch (type) {
      case 'photo':
        return '🖼️';
      case 'calendar':
        return '📅';
      case 'ocr':
        return '🔍';
      default:
        return '📌';
    }
  };
  
  return (
    <View style={styles.badge}>
      <AppText variant="xs" color="secondary">
        {getIcon()} {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
});