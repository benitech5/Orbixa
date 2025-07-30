import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import SettingsHeader from "./SettingsHeader";
import { useNavigation } from "@react-navigation/native";

const PrivacyAndSecurityScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <SettingsHeader title="Privacy and Security" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Last Seen & Online */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="time-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>Last Seen & Online</Text>
          <Text style={[styles.value, { color: theme.text }]}>Everyone</Text>
        </TouchableOpacity>

        {/* Profile Photo */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="person-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>Profile Photo</Text>
          <Text style={[styles.value, { color: theme.text }]}>Everyone</Text>
        </TouchableOpacity>

        {/* Forwarded Messages */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="arrow-redo-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>Forwarded Messages</Text>
          <Text style={[styles.value, { color: theme.text }]}>Everyone</Text>
        </TouchableOpacity>

        {/* Calls */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="call-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>Calls</Text>
          <Text style={[styles.value, { color: theme.text }]}>Everyone</Text>
        </TouchableOpacity>

        {/* Groups & Channels */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="people-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>Groups & Channels</Text>
          <Text style={[styles.value, { color: theme.text }]}>Everyone</Text>
        </TouchableOpacity>

        {/* Two-Step Verification */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="key-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>Two-Step Verification</Text>
          <Text style={[styles.value, { color: theme.text }]}>Off</Text>
        </TouchableOpacity>

        {/* Device Management */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="phone-portrait-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>Devices</Text>
          <Text style={[styles.value, { color: theme.text }]}>3 Devices</Text>
        </TouchableOpacity>

        {/* Auto-Delete Messages */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="trash-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>Auto-Delete Messages</Text>
          <Text style={[styles.value, { color: theme.text }]}>Off</Text>
        </TouchableOpacity>

        {/* Data Settings */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="stats-chart-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>Data Settings</Text>
          <Text style={[styles.value, { color: theme.text }]}>Standard</Text>
        </TouchableOpacity>

        {/* App Lock */}
        <TouchableOpacity style={styles.row} onPress={() => {}}>
          <Ionicons name="lock-closed-outline" size={22} style={styles.icon} />
          <Text style={styles.label}>App Lock</Text>
          <Text style={[styles.value, { color: theme.text }]}>Off</Text>
        </TouchableOpacity>

        {/* Explanation Text */}
        <Text style={[styles.infoText, { color: theme.text }]}>
          For enhanced privacy, your phone number is only visible to your contacts.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyAndSecurityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  icon: {
    marginRight: 16,
    color: "#000",
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  value: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 13,
    marginTop: 20,
    paddingHorizontal: 5,
  },
});
