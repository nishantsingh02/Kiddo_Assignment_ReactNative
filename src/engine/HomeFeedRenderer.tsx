import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { RegistryRenderer } from '../registry/RegistryRenderer';
import type { SDUINode } from '../types/payload.types';
import { SPACING } from '../styles/spacing';

let FlashList: any;
try {
  FlashList = require('@shopify/flash-list').FlashList;
} catch (e) {
  console.warn('[HomeFeedRenderer] FlashList failed to import, falling back to FlatList');
}

interface Props {
  sections: SDUINode[];
}

const DEFAULT_ESTIMATED_HEIGHT = 220;

export const HomeFeedRenderer: React.FC<Props> = ({ sections }) => {
  const keyExtractor = useCallback((item: SDUINode) => item.id, []);

  const renderItem = useCallback(({ item }: { item: SDUINode }) => {
    return <RegistryRenderer node={item} />;
  }, []);

  const getItemType = useCallback((item: SDUINode) => item.type, []);

  // Safe container styles padding at the bottom to clear navigation tabs
  const ListFooter = useMemo(() => <View style={styles.footer} />, []);

  if (FlashList) {
    return (
      <FlashList
        data={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={DEFAULT_ESTIMATED_HEIGHT}
        overrideItemType={getItemType}
        getItemType={getItemType}
        showsVerticalScrollIndicator={false}
        drawDistance={250}
        disableAutoLayout={false}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.listContent}
      />
    );
  }

  // Fallback to React Native FlatList if FlashList fails (e.g. environment issue)
  return (
    <FlatList
      data={sections}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={ListFooter}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: SPACING.space6,
  },
  footer: {
    height: 80, // Clearance for absolute campaign overlay / bottom nav
  },
});
