import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useSettings } from "../../SettingsContext";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import SettingsHeader from './SettingsHeader';

const ChatSettingsScreen = () => {
  const { theme, toggleTheme, isDarkMode, currentMode, chatSettings, updateMessageSize, updateMessageCorner } = useSettings();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [textSize, setTextSize] = useState(chatSettings?.messageSize || 16);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleThemeNavigation = () => {
    navigation.navigate('Theme' as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SettingsHeader title="Chat Settings" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Message Text Size Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Message text size</Text>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={30}
              value={textSize}
              onValueChange={(val) => setTextSize(val)}
              onSlidingComplete={(val) => updateMessageSize(Math.round(val))}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor={theme.border}
              thumbTintColor={theme.primary}
            />
            <Text style={[styles.sliderValue, { color: theme.primary }]}>{Math.round(textSize)}</Text>
          </View>

          {/* Chat Preview */}
          <View style={[styles.chatPreview, { backgroundColor: theme.card }]}>
            <View style={[styles.previewBubble, { backgroundColor: theme.background }]}>
              <Text style={[styles.previewText, { fontSize: textSize, color: theme.text }]}>
                hello
              </Text>
            </View>
            <View style={[styles.previewBubble, { backgroundColor: theme.background }]}>
              <Text style={[styles.previewText, { fontSize: textSize, color: theme.text }]}>
                how are you doing
              </Text>
            </View>
            <View style={[styles.previewBubbleRight, { backgroundColor: theme.primary }]}>
              <Text style={[styles.previewTextRight, { fontSize: textSize, color: '#fff' }]}>
                yeah
              </Text>
            </View>
          </View>
        </View>

        {/* Chat Customization Options */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.customizationItem, { borderBottomColor: theme.border }]}>
            <MaterialIcons name="wallpaper" size={24} color={theme.primary} />
            <Text style={[styles.customizationText, { color: theme.text }]}>Change Chat Wallpaper</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.customizationItem, { borderBottomColor: theme.border }]}>
            <MaterialIcons name="palette" size={24} color={theme.primary} />
            <Text style={[styles.customizationText, { color: theme.text }]}>Change Name Color</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        {/* Color Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Color theme</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.themeScroll}
          >
            {[...Array(6)].map((_, index) => (
              <TouchableOpacity key={index} style={styles.themeOption}>
                <View style={[styles.themePreview, { backgroundColor: theme.card }]}>
                  <View style={[styles.themeBubble1, { backgroundColor: theme.background }]} />
                  <View style={[styles.themeBubble2, { backgroundColor: theme.card }]} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Mode and Theme Options */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.customizationItem, { borderBottomColor: theme.border }]}
            onPress={handleThemeToggle}
          >
            <Ionicons name="moon" size={24} color={theme.primary} />
            <Text style={[styles.customizationText, { color: theme.text }]}>
              Switch to {isDarkMode ? 'light' : 'dark'} mode
            </Text>
            <Text style={[styles.currentMode, { color: theme.subtext }]}>
              {currentMode === 'system' ? 'System' : currentMode === 'dark' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.customizationItem, { borderBottomColor: theme.border }]}
            onPress={handleThemeNavigation}
          >
            <MaterialIcons name="format-paint" size={24} color={theme.primary} />
            <Text style={[styles.customizationText, { color: theme.text }]}>Browse themes</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        {/* App Icon Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>App icon</Text>
          <View style={styles.appIconContainer}>
            <View style={styles.appIconOption}>
              <View style={styles.appIcon1}>
                <View style={styles.appIcon1Inner}>
                  <MaterialIcons name="send" size={20} color="#fff" />
                </View>
              </View>
              <Text style={[styles.appIconText, { color: theme.text }]}>ORBIXA</Text>
            </View>

            <View style={styles.appIconOption}>
              <View style={styles.appIcon2}>
                <View style={styles.appIcon2Bubble1} />
                <View style={styles.appIcon2Bubble2}>
                  <MaterialIcons name="send" size={12} color="#fff" />
                </View>
              </View>
              <Text style={[styles.appIconText, { color: theme.text }]}>ORBIXA</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  slider: {
    flex: 1,
    marginRight: 16,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 30,
  },
  chatPreview: {
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },
  previewBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
  previewText: {
    // color will be set dynamically
  },
  previewBubbleRight: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: "flex-end",
    maxWidth: "70%",
  },
  previewTextRight: {
    color: "#fff",
  },
  customizationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  customizationText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  currentMode: {
    fontSize: 14,
    marginRight: 8,
  },
  themeScroll: {
    marginTop: 8,
  },
  themeOption: {
    marginRight: 12,
    alignItems: "center",
  },
  themePreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  themeBubble1: {
    width: 20,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  themeBubble2: {
    width: 16,
    height: 10,
    borderRadius: 5,
  },
  appIconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  appIconOption: {
    alignItems: "center",
  },
  appIcon1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  appIcon1Inner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
  },
  appIcon2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#b30032",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  appIcon2Bubble1: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#b30032",
    top: 5,
    left: 5,
  },
  appIcon2Bubble2: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#b30032",
    top: 15,
    left: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  appIconText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ChatSettingsScreen; 