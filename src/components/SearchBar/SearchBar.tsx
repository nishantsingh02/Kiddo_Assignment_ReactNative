import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { RADIUS, SPACING } from '../../styles/spacing';

export const SearchBar: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
            borderRadius: RADIUS.radiusFull,
          },
        ]}
      >
        <Feather name="search" size={18} color={theme.textDisabled} style={styles.searchIcon} />
        <TextInput
          placeholder="Search items, categories, or brands..."
          placeholderTextColor={theme.textDisabled}
          style={[styles.input, { color: theme.textPrimary }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: SPACING.space4,
    paddingVertical: SPACING.space2,
  },
  container: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    paddingVertical: 8,
  },
});
