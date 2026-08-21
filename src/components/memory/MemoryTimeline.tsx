import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { AppText } from '../common/AppText';

interface TimelineItem {
  time: string;
  title: string;
  type: 'photo' | 'calendar';
}

interface MemoryTimelineProps {
  items: TimelineItem[];
}

export const MemoryTimeline: React.FC < MemoryTimelineProps > = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.timeColumn}>
            <AppText variant="xs" color="muted" weight="bold">
              {item.time}
            </AppText>
          </View>
          <View style={styles.dotColumn}>
            <View style={styles.dot} />
            {index < items.length - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.contentColumn}>
            <AppText variant="sm" color="primary" weight="medium">
              {item.type === 'photo' ? '📷 Fotoğraf' : '📆 Etkinlik'}
            </AppText>
            <AppText variant="xs" color="secondary">
              {item.title}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timeColumn: {
    width: 50,
    alignItems: 'flex-end',
    paddingRight: spacing.sm,
  },
  dotColumn: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border.medium,
    marginTop: spacing.xs,
  },
  contentColumn: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginLeft: spacing.xs,
  },
});