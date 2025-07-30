import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useSettings } from '../../SettingsContext';
import SettingsHeader from './SettingsHeader';
import { useNavigation } from '@react-navigation/native';

const NotificationsAndSoundsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useSettings();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showReactions, setShowReactions] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Notifications & Sounds" onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.container}>
        {/* General Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>General</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Notifications</Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>Enable push notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={notificationsEnabled ? '#fff' : theme.subtext}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Sound</Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>Play sound for notifications</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={soundEnabled ? '#fff' : theme.subtext}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Vibration</Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>Vibrate for notifications</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={vibrationEnabled ? '#fff' : theme.subtext}
            />
          </View>
        </View>

        {/* Message Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Messages</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Show Preview</Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>Show message content in notifications</Text>
            </View>
            <Switch
              value={showPreview}
              onValueChange={setShowPreview}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={showPreview ? '#fff' : theme.subtext}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Show Reactions</Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>Show emoji reactions in notifications</Text>
            </View>
            <Switch
              value={showReactions}
              onValueChange={setShowReactions}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={showReactions ? '#fff' : theme.subtext}
            />
          </View>
        </View>

        {/* Call Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Calls</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Call Notifications</Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtext }]}>Notify for incoming calls</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#fff"
            />
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
  },
});

export default NotificationsAndSoundsScreen;
