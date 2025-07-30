import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../SettingsContext';

interface Props {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

const SettingsHeader: React.FC<Props> = ({ 
  title, 
  onBack, 
  right, 
  showSearch = false,
  onSearch,
  searchPlaceholder = "Search settings..."
}) => {
  const { theme } = useSettings();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
      onSearch?.('');
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearch?.(text);
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.background }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 32,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.background,
        position: 'relative',
        elevation: 2,
      }}>
        <TouchableOpacity
          onPress={onBack}
          style={{ position: 'absolute', left: 16, justifyContent: 'center' }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        {isSearchVisible ? (
          <View style={{ flex: 1, marginHorizontal: 60 }}>
            <TextInput
              style={{
                backgroundColor: theme.card,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                color: theme.text,
                fontSize: 16,
              }}
              placeholder={searchPlaceholder}
              placeholderTextColor={theme.subtext}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
            />
          </View>
        ) : (
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold' }}>
            {title}
          </Text>
        )}
        
        <View style={{ position: 'absolute', right: 16, flexDirection: 'row', alignItems: 'center' }}>
          {showSearch && (
            <TouchableOpacity
              onPress={handleSearchToggle}
              style={{ marginRight: right ? 12 : 0 }}
            >
              <Ionicons 
                name={isSearchVisible ? "close" : "search"} 
                size={24} 
                color={theme.text} 
              />
            </TouchableOpacity>
          )}
          {right && (
            <View>
              {right}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsHeader; 