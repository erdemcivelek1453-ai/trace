import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';
import { MemorySourceBadge } from '../../components/memory/MemorySourceBadge';
import { MemoryTimeline } from '../../components/memory/MemoryTimeline';

interface MemoryDetailScreenProps {
  memoryId: string;
  onBack: () => void;
}

export const MemoryDetailScreen: React.FC<MemoryDetailScreenProps> = ({ onBack }) => {
  // Mock veri
  const mockTimeline = [
    { time: '19:30', title: 'Akşam Yemeği Etkinliği', type: 'calendar' as const },
    { time: '22:10', title: 'Kadıköy Sahil Fotoğrafı', type: 'photo' as const },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppButton title="← Geri" variant="outline" onPress={onBack} style={styles.backButton} />

      <AppText variant="2xl" weight="bold" color="primary" style={styles.title}>
        İstanbul Gezisi
      </AppText>
      <AppText variant="sm" color="secondary" style={styles.date}>
        📍 İstanbul • 18 Ağustos 2026
      </AppText>

      <View style={styles.badgeRow}>
        <MemorySourceBadge type="photo" label="8 Fotoğraf" />
        <MemorySourceBadge type="calendar" label="1 Etkinlik" />
      </View>

      <View style={styles.section}>
        <AppText variant="xs" color="muted" weight="bold" style={styles.sectionTitle}>
          ZAMAN TÜNELİ (TIMELINE)
        </AppText>
        <MemoryTimeline items={mockTimeline} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  date: {
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
});