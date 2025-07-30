import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useSettings } from '../../SettingsContext';
import SettingsHeader from './SettingsHeader';
import { useNavigation } from '@react-navigation/native';

const PowerSavingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useSettings();
  const [powerSavingEnabled, setPowerSavingEnabled] = useState(false);
  const [batteryThreshold, setBatteryThreshold] = useState(20);

  const powerSavingOptions = [
    {
      id: 'stickers',
      label: 'Stickers and GIFs',
      enabled: false,
      icon: <MaterialCommunityIcons name="sticker-emoji" size={22} color={theme.accent} style={styles.icon} />,
    },
    {
      id: 'emoji',
      label: 'Emoji animations',
      enabled: false,
      icon: <Ionicons name="happy-outline" size={22} color={theme.accent} style={styles.icon} />,
    },
    {
      id: 'messageEffects',
      label: 'Message effects',
      enabled: false,
      icon: <MaterialCommunityIcons name="message-processing-outline" size={22} color={theme.accent} style={styles.icon} />,
    },
    {
      id: 'callEffects',
      label: 'Call effects',
      enabled: false,
      icon: <Ionicons name="call-outline" size={22} color={theme.accent} style={styles.icon} />,
    },
    {
      id: 'videoPlayback',
      label: 'Video playback effects',
      enabled: false,
      icon: <MaterialIcons name="play-circle-outline" size={22} color={theme.accent} style={styles.icon} />,
    },
    {
      id: 'videoCalls',
      label: 'Video call effects',
      enabled: false,
      icon: <FontAwesome5 name="file-video" size={22} color={theme.accent} style={styles.icon} />,
    },
    {
      id: 'backgroundEffects',
      label: 'Background effects',
      enabled: false,
      icon: <FontAwesome name="exchange" size={22} color={theme.accent} style={styles.icon} />,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Power Saving" onBack={() => navigation.goBack()} />

      <View style={styles.container}>
        {/* Battery Threshold Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.accent }]}>
            Power saving mode
            <Text style={{ color: theme.subtext, fontWeight: 'normal' }}>
              {' '}Reduces battery usage by limiting some features
            </Text>
          </Text>

          <View style={styles.thresholdContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Off</Text>
            <Text style={[styles.label, { color: theme.text }]}>Below {batteryThreshold}%</Text>
          </View>

          <Switch
            value={powerSavingEnabled}
            onValueChange={setPowerSavingEnabled}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor={theme.accent}
          />

          <Text style={[styles.label, { color: theme.text }]}>On</Text>

          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={50}
            value={batteryThreshold}
            onValueChange={setBatteryThreshold}
            minimumTrackTintColor={theme.accent}
            thumbTintColor={theme.accent}
          />

          <Text style={[styles.infoText, { color: theme.subtext }]}>
            Power saving mode will automatically activate when your battery level drops below the selected threshold.
          </Text>
        </View>

        {/* Power Saving Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.accent }]}>Power saving options</Text>
          
          {powerSavingOptions.map((option) => (
            <View key={option.id} style={styles.optionRow}>
              {option.icon}
              <Text style={[styles.label, { color: theme.text, flex: 1 }]}>{option.label}</Text>
              <Switch
                value={option.enabled}
                onValueChange={() => {}}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor={theme.accent}
              />
            </View>
          ))}

          <Text style={[styles.infoText, { color: theme.subtext }]}>
            These features will be limited when power saving mode is active to help conserve battery life.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  thresholdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  icon: {
    marginRight: 12,
  },
});

export default PowerSavingScreen;
