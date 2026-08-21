import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../theme/colors';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { SyncSetupScreen } from '../screens/onboarding/SyncSetupScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SearchScreen } from '../screens/search/SearchScreen';
import { MemoryDetailScreen } from '../screens/memory/MemoryDetailScreen';

type ScreenState = |
  { name: 'WELCOME' } |
  { name: 'SYNC_SETUP' } |
  { name: 'HOME' } |
  { name: 'SEARCH';query: string } |
  { name: 'MEMORY_DETAIL';memoryId: string };

export const AppNavigator: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState < ScreenState > ({ name: 'WELCOME' });
    
    const renderScreen = () => {
      switch (currentScreen.name) {
        case 'WELCOME':
          return (
            <WelcomeScreen
            onNext={() => setCurrentScreen({ name: 'SYNC_SETUP' })}
          />
          );
          
        case 'SYNC_SETUP':
          return (
            <SyncSetupScreen
            onComplete={() => setCurrentScreen({ name: 'HOME' })}
          />
          );
          
        case 'HOME':
          return (
            <HomeScreen
            onQuestionSubmit={(q) => setCurrentScreen({ name: 'SEARCH', query: q })}
            onMemoryPress={(mId) => setCurrentScreen({ name: 'MEMORY_DETAIL', memoryId: mId })}
          />
          );
          
        case 'SEARCH':
          return (
            <SearchScreen
            initialQuery={currentScreen.query}
            onBack={() => setCurrentScreen({ name: 'HOME' })}
            onMemoryDetailPress={(mId) => setCurrentScreen({ name: 'MEMORY_DETAIL', memoryId: mId })}
          />
          );
          
        case 'MEMORY_DETAIL':
          return (
            <MemoryDetailScreen
            memoryId={currentScreen.memoryId}
            onBack={() => setCurrentScreen({ name: 'HOME' })}
          />
          );
          
        default:
          return <HomeScreen onQuestionSubmit={() => {}} onMemoryPress={() => {}} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      {renderScreen()}
    </SafeAreaView>
        );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background.primary,
      },
    });