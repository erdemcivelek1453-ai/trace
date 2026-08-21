import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AppText } from '../common/AppText';

interface HomeHeaderProps {
  onSyncPress ? : () => void;
  isSyncing ? : boolean;
}

export const HomeHeader: React.FC < HomeHeaderProps > = ({
  onSyncPress,
  isSyncing = false,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <AppText variant="2xl" weight="bold" color="primary">
          TRACE
        </AppText>
        <AppText variant="xs" color="secondary">
          Kişisel Hafıza Asistanı
        </AppText>
      </View>

      <TouchableOpacity
        onPress={onSyncPress}
        activeOpacity={0.7}
        style={styles.syncBadge}
      >
        <View
          style={[
            styles.syncIndicator,
            { backgroundColor: isSyncing ? colors.status.warning : colors.status.success },
          ]}
        />
        <AppText variant="xs" weight="medium" color="secondary">
          {isSyncing ? 'Eşitleniyor...' : 'Senkronize'}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  syncIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
});