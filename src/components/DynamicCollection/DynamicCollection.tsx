import React, { memo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { CollectionItem } from './CollectionItem';
import { useTheme } from '../../context/ThemeContext';
import type { DynamicCollectionNode, CollectionItem as CollectionItemType } from '../../types/payload.types';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

interface Props {
  node: DynamicCollectionNode;
}

const DynamicCollectionInner: React.FC<Props> = ({ node }) => {
  const theme = useTheme();

  const renderItem = useCallback(
    ({ item }: { item: CollectionItemType }) => (
      <CollectionItem key={item.id} item={item} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: CollectionItemType) => item.id,
    []
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textPrimary }]}>
        {node.theme_label}
      </Text>
      
      <FlatList
        data={node.items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        
        // Android nested scroll configuration
        nestedScrollEnabled={true}
        // Locks scroll axis on iOS, preventing diagonal scroll jank
        directionalLockEnabled={true}
        scrollToOverflowEnabled={false}
        
        decelerationRate="fast"
        snapToInterval={168} // card width (156) + gap (12) = 168
        snapToAlignment="start"
        contentContainerStyle={styles.listContent}
        
        // O(1) scroll offset layout optimization
        getItemLayout={(_, index) => ({
          length: 168,
          offset: 168 * index,
          index,
        })}
        
        // Performance optimizations
        removeClippedSubviews={true}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
      />
    </View>
  );
};

export const DynamicCollection = memo(DynamicCollectionInner);

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.space3,
  },
  label: {
    ...TYPOGRAPHY.heading3,
    paddingHorizontal: SPACING.space4,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  listContent: {
    paddingHorizontal: SPACING.space4,
    gap: 12,
  },
});
