import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { AppText } from '../common/AppText';

interface RecentMemoryCardProps {
  title: string;
  date: string;
  photoCount ? : number;
  eventCount ? : number;
  location ? : string;
  onPress ? : () => void;
}

export const RecentMemoryCard: React.FC < RecentMemoryCardProps > = ({
  title,
  date,
  photoCount = 0,
  eventCount = 0,
  location,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <AppText variant="md" weight="bold" color="primary" numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="xs" color="muted">
          {date}
        </AppText>
      </View>

      {location && (
        <AppText variant="sm" color="secondary" style={styles.location}>
          📍 {location}
        </AppText>
      )}

      <View style={styles.badgeRow}>
        {photoCount > 0 && (
          <View style={styles.badge}>
            <AppText variant="xs" color="secondary">
              🖼️ {photoCount} foto
            </AppText>
          </View>
        )}
        {eventCount > 0 && (
          <View style={styles.badge}>
            <AppText variant="xs" color="secondary">
              📅 {eventCount} etkinlik
            </AppText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  location: {
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
});