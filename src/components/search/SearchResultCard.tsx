import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { AppText } from '../common/AppText';

interface SearchResultCardProps {
  answer: string;
  confidence: number;
  memoryRefsCount: number;
  onViewDetails ? : () => void;
}

export const SearchResultCard: React.FC < SearchResultCardProps > = ({
  answer,
  confidence,
  memoryRefsCount,
  onViewDetails,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText variant="xs" color="accent" weight="bold">
          AI YANITI (AI RESPONSE)
        </AppText>
        <AppText variant="xs" color="muted">
          Güven: %{Math.round(confidence * 100)}
        </AppText>
      </View>

      <AppText variant="md" color="primary" weight="medium" style={styles.answerText}>
        "{answer}"
      </AppText>

      <View style={styles.footer}>
        <AppText variant="xs" color="secondary">
          📌 {memoryRefsCount} kaynak anı bulundu
        </AppText>

        {onViewDetails && (
          <TouchableOpacity onPress={onViewDetails} style={styles.detailButton}>
            <AppText variant="xs" color="accent" weight="bold">
              Kanıtları Gör →
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.focus,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  answerText: {
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  detailButton: {
    paddingVertical: spacing.xs,
  },
});