import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useSettings } from '../../SettingsContext';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { logout } from '../../store/authSlice';
import { Ionicons } from '@expo/vector-icons';
import SettingsHeader from './SettingsHeader';

type SettingsNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'Settings'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const SettingsScreen: React.FC<{ navigation: SettingsNavigationProp }> = ({ navigation }) => {
  const { theme } = useSettings();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const [searchQuery, setSearchQuery] = useState('');

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoDownloadMedia, setAutoDownloadMedia] = useState(false);
  const [saveToGallery, setSaveToGallery] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout', style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.reset({ index: 0, routes: [{ name: 'Onboarding' as never }] });
          }
        }
      ]
    );
  };

  // All of your sections in one array
  const allSections = [
    {
      title: 'Account',
      items: [
        { id: 'profile', title: 'Profile', subtitle: user?.name || 'Set up your profile', icon: 'person', type: 'navigate', route: 'Profile' },
        { id: 'privacy', title: 'Privacy & Security', subtitle: 'Last seen, profile photo, blocks', icon: 'shield-checkmark', type: 'navigate', route: 'Privacy' },
        { id: 'devices', title: 'Devices', subtitle: 'Manage active sessions', icon: 'phone-portrait', type: 'navigate', route: 'Devices' },
        { id: 'storage', title: 'Data & Storage', subtitle: 'Manage storage and data usage', icon: 'cloud-download', type: 'navigate', route: 'DataAndStorage' },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { id: 'notif', title: 'Notifications', subtitle: 'Enable push notifications', icon: 'notifications', type: 'toggle', value: notificationsEnabled, onToggle: setNotificationsEnabled },
        { id: 'sound', title: 'Sound', subtitle: 'Play sound for notifications', icon: 'volume-high', type: 'toggle', value: soundEnabled, onToggle: setSoundEnabled },
        { id: 'vibrate', title: 'Vibration', subtitle: 'Vibrate for notifications', icon: 'phone-portrait', type: 'toggle', value: vibrationEnabled, onToggle: setVibrationEnabled },
        { id: 'notif-set', title: 'Notification Settings', subtitle: 'Customize notification preferences', icon: 'settings', type: 'navigate', route: 'Notifications' },
      ]
    },
    {
      title: 'Chats',
      items: [
        { id: 'chat-settings', title: 'Chat Settings', subtitle: 'Dark mode, font size, etc.', icon: 'chatbubble-ellipses', type: 'navigate', route: 'ChatSettings' },
        { id: 'theme', title: 'Theme', subtitle: 'Light, Dark, or System', icon: 'color-palette', type: 'navigate', route: 'Theme' },
        { id: 'folders', title: 'Chat Folders', subtitle: 'Organize your chats', icon: 'folder', type: 'navigate', route: 'ChatFolders' },
        { id: 'auto-download', title: 'Auto-Download Media', subtitle: 'Download photos & videos', icon: 'download', type: 'toggle', value: autoDownloadMedia, onToggle: setAutoDownloadMedia },
        { id: 'gallery', title: 'Save to Gallery', subtitle: 'Save media locally', icon: 'images', type: 'toggle', value: saveToGallery, onToggle: setSaveToGallery },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'help', title: 'Help Center', subtitle: 'Get help and support', icon: 'help-circle', type: 'action', onPress: () => Alert.alert('Help', 'Help center...') },
        { id: 'contact', title: 'Contact Us', subtitle: 'Reach our support team', icon: 'mail', type: 'action', onPress: () => Alert.alert('Contact', 'Contact form...') },
        { id: 'privacy-policy', title: 'Privacy Policy', subtitle: 'Read our policy', icon: 'document-text', type: 'action', onPress: () => Alert.alert('Privacy Policy', 'Privacy policy...') },
        { id: 'terms', title: 'Terms of Service', subtitle: 'Read our terms', icon: 'document', type: 'action', onPress: () => Alert.alert('Terms', 'Terms of service...') },
      ]
    },
    {
      title: 'Account Actions',
      items: [
        { id: 'logout', title: 'Logout', subtitle: 'Sign out of your account', icon: 'log-out', type: 'action', onPress: handleLogout }
      ]
    }
  ] as const;

  // Filter sections based on search query
  const sections = useMemo(() => {
    if (!searchQuery.trim()) {
      return allSections;
    }

    const query = searchQuery.toLowerCase();
    return allSections.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
      )
    })).filter(section => section.items.length > 0);
  }, [allSections, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SettingsHeader 
        title="Settings" 
        onBack={() => navigation.goBack()} 
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Search settings..."
      />

      <ScrollView contentContainerStyle={styles.content}>
        {sections.length === 0 && searchQuery.trim() ? (
          <View style={styles.noResults}>
            <Text style={[styles.noResultsText, { color: theme.subtext }]}>
              No settings found for "{searchQuery}"
            </Text>
          </View>
        ) : (
          sections.map(sec => (
            <View key={sec.title}>
              <Text style={[styles.sectionHeader, { color: theme.subtext }]}>{sec.title}</Text>
              {sec.items.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={() => {
                    if (item.type === 'navigate') navigation.navigate(item.route as any);
                    else if (item.type === 'action' && item.onPress) item.onPress();
                  }}
                  disabled={item.type === 'toggle'}
                >
                  <Ionicons name={item.icon} size={20} color={theme.primary} />
                  <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                    {item.subtitle && <Text style={[styles.subtitle, { color: theme.subtext }]}>{item.subtitle}</Text>}
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value!}
                      onValueChange={item.onToggle}
                      trackColor={{ false: theme.border, true: theme.primary }}
                      thumbColor={item.value ? '#fff' : theme.subtext}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={theme.subtext} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  sectionHeader: { marginTop: 24, marginBottom: 8, fontSize: 14, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8
  },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16 },
  subtitle: { fontSize: 12, marginTop: 2 },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  }
});
