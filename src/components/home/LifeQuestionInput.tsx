import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AppText } from '../common/AppText';

interface LifeQuestionInputProps {
  onSubmit: (question: string) => void;
}

export const LifeQuestionInput: React.FC < LifeQuestionInputProps > = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  
  const handleSearch = () => {
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };
  
  const sampleQueries = [
    'Geçen yaz ne yaptım?',
    'İstanbul\'a en son ne zaman gittim?',
    'Son tatilim nasıldı?',
  ];
  
  return (
    <View style={styles.container}>
      <AppText variant="xl" weight="bold" color="primary" style={styles.title}>
        Hayatına bir soru sor.
      </AppText>

      <View style={styles.inputWrapper}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Örn: Geçen yıl bugün ne yaptım?"
          placeholderTextColor={colors.text.muted}
          style={styles.input}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={handleSearch}
          activeOpacity={0.8}
          style={styles.searchButton}
        >
          <AppText variant="sm" weight="bold" color="primary">
            Sor
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsContainer}>
        <AppText variant="xs" color="muted" style={styles.suggestionTitle}>
          ÖRNEK SORULAR
        </AppText>
        <View style={styles.chipsRow}>
          {sampleQueries.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setQuery(item);
                onSubmit(item);
              }}
              style={styles.chip}
            >
              <AppText variant="xs" color="secondary">
                "{item}"
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.md,
  },
  searchButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  suggestionsContainer: {
    marginTop: spacing.lg,
  },
  suggestionTitle: {
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginBottom: spacing.xs,
  },
});