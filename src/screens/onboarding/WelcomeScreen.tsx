import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';
import { OnboardingCard } from '../../components/onboarding/OnboardingCard';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC < WelcomeScreenProps > = ({ onNext }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText variant="2xl" weight="bold" color="primary">
          TRACE
        </AppText>
        <AppText variant="md" color="secondary" style={styles.subtitle}>
          Kişisel Hafıza Asistanınız
        </AppText>
      </View>

      <OnboardingCard
        icon="🧠"
        title="Anılarınızı Birleştirin"
        description="Fotoğraflarınız, takvim kayıtlarınız ve notlarınız otomatik olarak anlamlı anılara dönüştürülür."
      />

      <OnboardingCard
        icon="💬"
        title="Hayatınıza Soru Sorun"
        description="Geçmişte ne zaman nereye gittiğinizi, kiminle tanıştığınızı saniyeler içinde sorgulayın."
      />

      <View style={styles.footer}>
        <AppButton title="Başlayalım" onPress={onNext} variant="primary" />
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});