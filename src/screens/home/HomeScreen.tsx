import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AppText } from '../../components/common/AppText';
import { HomeHeader } from '../../components/home/HomeHeader';
import { LifeQuestionInput } from '../../components/home/LifeQuestionInput';
import { RecentMemoryCard } from '../../components/home/RecentMemoryCard';

interface HomeScreenProps {
  onQuestionSubmit: (question: string) => void;
  onMemoryPress: (memoryId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onQuestionSubmit,
  onMemoryPress,
}) => {
  // Mock veriler UI testi için
  const mockMemories = [
    {
      id: 'mem_1',
      title: 'İstanbul Gezisi ve Kadıköy Toplantısı',
      date: '18 Ağustos 2026',
      location: 'İstanbul',
      photoCount: 8,
      eventCount: 1,
    },
    {
      id: 'mem_2',
      title: 'Çanakkale İnovasyon Kampı',
      date: '15 Mayıs 2026',
      location: 'Çanakkale',
      photoCount: 12,
      eventCount: 2,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HomeHeader />

      <LifeQuestionInput onSubmit={onQuestionSubmit} />

      <View style={styles.memoriesSection}>
        <AppText variant="xs" color="muted" style={styles.sectionTitle}>
          ANILARIN (YOUR MEMORIES)
        </AppText>

        {mockMemories.map((mem) => (
          <RecentMemoryCard
            key={mem.id}
            title={mem.title}
            date={mem.date}
            location={mem.location}
            photoCount={mem.photoCount}
            eventCount={mem.eventCount}
            onPress={() => onMemoryPress(mem.id)}
          />
        ))}
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
    paddingBottom: spacing['2xl'],
  },
  memoriesSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  sectionTitle: {
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
});