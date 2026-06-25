import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductCard } from './ProductCard';
import { useTheme } from '../../context/ThemeContext';
import type { ProductGrid2x2Node } from '../../types/payload.types';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

interface Props {
  node: ProductGrid2x2Node;
}

// Splits the product array into rows of specified size
const chunkArray = <T,>(arr: T[], size: number): T[][] =>
  arr.reduce<T[][]>((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);

const ProductGrid2x2Inner: React.FC<Props> = ({ node }) => {
  const theme = useTheme();
  const rows = chunkArray(node.products, 2);

  return (
    <View style={styles.container}>
      {node.heading && (
        <Text style={[styles.heading, { color: theme.textPrimary }]}>
          {node.heading}
        </Text>
      )}
      {rows.map((row, rowIndex) => (
        <View key={`row_${rowIndex}`} style={styles.row}>
          {row.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Fill empty cell if odd number of products */}
          {row.length === 1 && <View style={styles.emptyCell} />}
        </View>
      ))}
    </View>
  );
};

export const ProductGrid2x2 = memo(ProductGrid2x2Inner);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.space4,
    paddingVertical: SPACING.space2,
  },
  heading: {
    ...TYPOGRAPHY.heading3,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  emptyCell: {
    flex: 1,
  },
});
