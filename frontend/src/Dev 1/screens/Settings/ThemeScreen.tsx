import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import SettingsHeader from './SettingsHeader';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../../SettingsContext';
import { Ionicons } from '@expo/vector-icons';

const ThemeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, setThemeMode, currentMode } = useSettings();

  const themeOptions = [
    {
      id: 'light',
      title: 'Light',
      subtitle: 'Classic light theme',
      icon: 'sunny' as const,
      preview: {
        background: '#fff',
        text: '#222',
        card: '#f5f5f5',
        border: '#eee'
      }
    },
    {
      id: 'dark',
      title: 'Dark',
      subtitle: 'Easy on the eyes',
      icon: 'moon' as const,
      preview: {
        background: '#232634',
        text: '#fff',
        card: '#2a2d3a',
        border: '#2a2d3a'
      }
    },
    {
      id: 'system',
      title: 'System',
      subtitle: 'Follows your device settings',
      icon: 'settings' as const,
      preview: {
        background: '#f8f9fa',
        text: '#495057',
        card: '#fff',
        border: '#dee2e6'
      }
    }
  ];

  const handleThemeSelect = (themeId: 'light' | 'dark' | 'system') => {
    setThemeMode(themeId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Theme" onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.container}>
        <Text style={[styles.description, { color: theme.subtext }]}>
          Choose your preferred theme. The system theme will automatically follow your device's appearance settings.
        </Text>

        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.themeOption,
              { 
                backgroundColor: theme.card, 
                borderColor: currentMode === option.id ? theme.primary : theme.border 
              }
            ]}
            onPress={() => handleThemeSelect(option.id as 'light' | 'dark' | 'system')}
          >
            <View style={styles.themeInfo}>
              <View style={styles.themeHeader}>
                <Ionicons 
                  name={option.icon} 
                  size={24} 
                  color={currentMode === option.id ? theme.primary : theme.text} 
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.themeTitle, { color: theme.text }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.themeSubtitle, { color: theme.subtext }]}>
                    {option.subtitle}
                  </Text>
                </View>
              </View>
              
              <View style={styles.previewContainer}>
                <View style={[styles.preview, { backgroundColor: option.preview.background }]}>
                  <View style={[styles.previewHeader, { backgroundColor: option.preview.card }]}>
                    <View style={[styles.previewDot, { backgroundColor: option.preview.text }]} />
                    <View style={[styles.previewDot, { backgroundColor: option.preview.text }]} />
                    <View style={[styles.previewDot, { backgroundColor: option.preview.text }]} />
                  </View>
                  <View style={styles.previewContent}>
                    <View style={[styles.previewLine, { backgroundColor: option.preview.text }]} />
                    <View style={[styles.previewLine, { backgroundColor: option.preview.text, width: '60%' }]} />
                    <View style={[styles.previewLine, { backgroundColor: option.preview.text, width: '40%' }]} />
                  </View>
                </View>
              </View>
            </View>

            {currentMode === option.id && (
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={theme.primary} 
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>
            About themes
          </Text>
          <Text style={[styles.infoText, { color: theme.subtext }]}>
            • Light theme provides a clean, bright interface{'\n'}
            • Dark theme reduces eye strain in low-light conditions{'\n'}
            • System theme automatically matches your device settings
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  themeOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeInfo: {
    flex: 1,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeSubtitle: {
    fontSize: 14,
  },
  previewContainer: {
    alignItems: 'center',
  },
  preview: {
    width: 80,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewHeader: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  previewContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    gap: 4,
  },
  previewLine: {
    height: 2,
    borderRadius: 1,
  },
  checkIcon: {
    marginLeft: 12,
  },
  infoSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ThemeScreen;