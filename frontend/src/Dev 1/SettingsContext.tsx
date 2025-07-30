import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// Theme definitions
const lightTheme = {
  mode: 'light',
  background: '#fff',
  text: '#222',
  primary: '#007AFF',
  accent: '#e53935',
  card: '#f5f5f5',
  border: '#eee',
  subtext: '#888',
  buttonBg: '#ffeaea',
  buttonText: '#e53935',
};

const darkTheme = {
  mode: 'dark',
  background: '#232634',
  text: '#fff',
  primary: '#007AFF',
  accent: '#e53935',
  card: '#2a2d3a',
  border: '#2a2d3a',
  subtext: '#bbb',
  buttonBg: '#31344b',
  buttonText: '#fff',
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ChatSettings {
  messageSize: number;
  messageCorner: number;
}

interface DataAndStorageSettings {
  autoDownloadMobileData: boolean;
  autoDownloadWifi: boolean;
  autoDownloadRoaming: boolean;
  saveToGalleryPrivate: boolean;
  saveToGalleryGroups: boolean;
  saveToGalleryChannels: boolean;
  streaming: boolean;
}

interface SettingsContextType {
  // Theme management
  theme: typeof lightTheme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
  currentMode: ThemeMode;
  
  // Chat settings
  chatSettings: ChatSettings;
  updateMessageSize: (size: number) => void;
  updateMessageCorner: (corner: number) => void;
  
  // Data and storage settings
  dataAndStorageSettings: DataAndStorageSettings;
  updateDataAndStorageSetting: (key: keyof DataAndStorageSettings, value: boolean) => void;
  resetDataAndStorageSettings: () => void;
  
  // General
  isLoading: boolean;
}

const defaultSettings: ChatSettings = {
  messageSize: 16,
  messageCorner: 17,
};

const defaultDataAndStorageSettings: DataAndStorageSettings = {
  autoDownloadMobileData: false,
  autoDownloadWifi: false,
  autoDownloadRoaming: false,
  saveToGalleryPrivate: false,
  saveToGalleryGroups: false,
  saveToGalleryChannels: false,
  streaming: true,
};

const SettingsContext = createContext<SettingsContextType>({
  // Theme defaults
  theme: lightTheme,
  toggleTheme: () => {},
  setThemeMode: () => {},
  isDarkMode: false,
  currentMode: 'light',
  
  // Chat settings defaults
  chatSettings: defaultSettings,
  updateMessageSize: () => {},
  updateMessageCorner: () => {},
  
  // Data and storage defaults
  dataAndStorageSettings: defaultDataAndStorageSettings,
  updateDataAndStorageSetting: () => {},
  resetDataAndStorageSettings: () => {},
  
  // General
  isLoading: true,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Theme state
  const [theme, setTheme] = useState(lightTheme);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  
  // Settings state
  const [chatSettings, setChatSettings] = useState<ChatSettings>(defaultSettings);
  const [dataAndStorageSettings, setDataAndStorageSettings] = useState<DataAndStorageSettings>(defaultDataAndStorageSettings);
  const [isLoading, setIsLoading] = useState(true);
  
  const systemColorScheme = useColorScheme();

  // Load all settings from AsyncStorage on app start
  useEffect(() => {
    loadAllSettings();
  }, []);

  // Update theme when system color scheme changes (for 'system' mode)
  useEffect(() => {
    if (themeMode === 'system') {
      const newTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
      setTheme(newTheme);
    }
  }, [systemColorScheme, themeMode]);

  const loadAllSettings = async () => {
    try {
      // Load theme settings
      const savedThemeMode = await AsyncStorage.getItem('themeMode') as ThemeMode;
      if (savedThemeMode) {
        setThemeMode(savedThemeMode);
        if (savedThemeMode === 'system') {
          const newTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
          setTheme(newTheme);
        } else if (savedThemeMode === 'dark') {
          setTheme(darkTheme);
        } else {
          setTheme(lightTheme);
        }
      }

      // Load chat settings
      const savedChatSettings = await AsyncStorage.getItem('chatSettings');
      if (savedChatSettings) {
        const parsedSettings = JSON.parse(savedChatSettings);
        setChatSettings(parsedSettings);
      }

      // Load data and storage settings
      const savedDataAndStorageSettings = await AsyncStorage.getItem('dataAndStorageSettings');
      if (savedDataAndStorageSettings) {
        const parsedDataSettings = JSON.parse(savedDataAndStorageSettings);
        setDataAndStorageSettings(parsedDataSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Theme management functions
  const saveThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const setThemeModeHandler = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveThemeMode(mode);
    
    if (mode === 'system') {
      const newTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
      setTheme(newTheme);
    } else if (mode === 'dark') {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeModeHandler(newMode);
  };

  // Chat settings functions
  const saveChatSettings = async (newSettings: ChatSettings) => {
    try {
      await AsyncStorage.setItem('chatSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving chat settings:', error);
    }
  };

  const updateMessageSize = (size: number) => {
    const newSettings = { ...chatSettings, messageSize: size };
    setChatSettings(newSettings);
    saveChatSettings(newSettings);
  };

  const updateMessageCorner = (corner: number) => {
    const newSettings = { ...chatSettings, messageCorner: corner };
    setChatSettings(newSettings);
    saveChatSettings(newSettings);
  };

  // Data and storage settings functions
  const saveDataAndStorageSettings = async (newSettings: DataAndStorageSettings) => {
    try {
      await AsyncStorage.setItem('dataAndStorageSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving data and storage settings:', error);
    }
  };

  const updateDataAndStorageSetting = (key: keyof DataAndStorageSettings, value: boolean) => {
    const newSettings = { ...dataAndStorageSettings, [key]: value };
    setDataAndStorageSettings(newSettings);
    saveDataAndStorageSettings(newSettings);
    
    // Example: What should happen when toggles are true/false
    switch (key) {
      case 'saveToGalleryPrivate':
      case 'saveToGalleryGroups':
      case 'saveToGalleryChannels':
        // If true: Media is saved to gallery. If false: Media is not saved.
        // Implement actual media handling logic elsewhere in the app.
        break;
      case 'autoDownloadMobileData':
      case 'autoDownloadWifi':
      case 'autoDownloadRoaming':
        // If true: Media auto-downloads under that condition. If false: User must manually download.
        break;
      case 'streaming':
        // If true: Stream videos/audio directly. If false: Require full download before playback.
        break;
      default:
        break;
    }
  };

  const resetDataAndStorageSettings = () => {
    setDataAndStorageSettings(defaultDataAndStorageSettings);
    saveDataAndStorageSettings(defaultDataAndStorageSettings);
    // Reset logic: All toggles to default values
  };

  if (isLoading) {
    // Return a loading state or default theme while loading
    return <>{children}</>;
  }

  return (
    <SettingsContext.Provider
      value={{
        // Theme
        theme,
        toggleTheme,
        setThemeMode: setThemeModeHandler,
        isDarkMode: theme.mode === 'dark',
        currentMode: themeMode,
        
        // Chat settings
        chatSettings,
        updateMessageSize,
        updateMessageCorner,
        
        // Data and storage settings
        dataAndStorageSettings,
        updateDataAndStorageSetting,
        resetDataAndStorageSettings,
        
        // General
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext); 