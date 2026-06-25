import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RADIUS, SPACING } from '../../styles/spacing';

const FILTERS = ['All Items', 'Latest Arrivals', 'Popular', 'Sale', 'New Outfits', 'Water Toys'];

interface FilterChipsProps {
  onSelectFilter?: (filter: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ onSelectFilter }) => {
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('All Items');

  const handlePress = (filter: string) => {
    setSelectedFilter(filter);
    if (onSelectFilter) {
      onSelectFilter(filter);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
    >
      {FILTERS.map((filter) => {
        const isActive = filter === selectedFilter;
        return (
          <Pressable
            key={filter}
            onPress={() => handlePress(filter)}
            style={({ pressed }) => [
              styles.chip,
              {
                borderRadius: RADIUS.radiusFull,
                backgroundColor: isActive ? theme.primary : theme.surface,
                borderColor: isActive ? theme.primary : theme.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isActive ? '#FFFFFF' : theme.textSecondary,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 52,
    marginVertical: SPACING.space1,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.space4,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    height: '100%',
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
});
