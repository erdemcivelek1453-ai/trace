import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';

interface SyncSetupScreenProps {
  onComplete: () => void;
}

export const SyncSetupScreen: React.FC < SyncSetupScreenProps > = ({ onComplete }) => {
  const [photosEnabled, setPhotosEnabled] = useState(true);
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="xl" weight="bold" color="primary">
          Hafıza Kaynakları
        </AppText>
        <AppText variant="sm" color="secondary" style={styles.subtitle}>
          Hangi verilerinizin yerel hafıza dizinine ekleneceğini seçin.
        </AppText>
      </View>

      <View style={styles.optionRow}>
        <View style={styles.optionText}>
          <AppText variant="md" weight="bold" color="primary">
            🖼️ Galeri / Fotoğraflar
          </AppText>
          <AppText variant="xs" color="muted">
            Fotoğraf konum ve zaman bilgileri taranır
          </AppText>
        </View>
        <Switch
          value={photosEnabled}
          onValueChange={setPhotosEnabled}
          trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
        />
      </View>

      <View style={styles.optionRow}>
        <View style={styles.optionText}>
          <AppText variant="md" weight="bold" color="primary">
            📅 Takvim Etkinlikleri
          </AppText>
          <AppText variant="xs" color="muted">
            Geçmiş ve gelecek etkinlikleriniz senkronize edilir
          </AppText>
        </View>
        <Switch
          value={calendarEnabled}
          onValueChange={setCalendarEnabled}
          trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
        />
      </View>

      <View style={styles.footer}>
        <AppButton title="Kurulumu Tamamla" onPress={onComplete} variant="primary" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  optionText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
  },
});