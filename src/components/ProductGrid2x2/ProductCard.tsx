import React, { memo, useCallback } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { handleAction } from '../../dispatcher/ActionDispatcher';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { resolveImage } from '../../utils/imageResolver';
import type { ProductItem } from '../../types/payload.types';
import { RADIUS, SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

interface Props {
  product: ProductItem;
}

const ProductCardInner: React.FC<Props> = ({ product }) => {
  const theme = useTheme();
  // Subscribe to ONLY this specific product's quantity
  const quantity = useCart((state) => state.quantities[product.id] ?? 0);

  const onCardPress = useCallback(() => {
    handleAction(product.action);
  }, [product.action]);

  const onAddToCart = useCallback(() => {
    handleAction(product.add_to_cart_action);
  }, [product.add_to_cart_action]);

  const imageSource = resolveImage(product.image_url, product.local_image);

  // Determine badge background color based on text
  const getBadgeColor = (badgeText: string) => {
    switch (badgeText.toUpperCase()) {
      case 'SALE':
        return theme.error;
      case 'NEW':
        return theme.primary;
      case 'HOT':
        return theme.warning;
      default:
        return theme.accent;
    }
  };

  return (
    <Pressable
      onPress={onCardPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: RADIUS.radiusMedium,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />
        {product.badge && (
          <View style={[styles.badge, { backgroundColor: getBadgeColor(product.badge), borderRadius: RADIUS.radiusSmall }]}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={2}>
        {product.name}
      </Text>

      <View style={styles.priceRow}>
        <Text style={[styles.price, { color: theme.textPrimary }]}>₹{product.price}</Text>
        {product.original_price && (
          <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
            ₹{product.original_price}
          </Text>
        )}
      </View>

      <Pressable
        onPress={onAddToCart}
        style={({ pressed }) => [
          styles.addBtn,
          {
            backgroundColor: quantity > 0 ? '#006666' : theme.primary,
            borderRadius: RADIUS.radiusSmall,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={styles.addBtnText}>
          {quantity > 0 ? `In Cart: ${quantity}` : '＋ Add'}
        </Text>
      </Pressable>
    </Pressable>
  );
};

export const ProductCard = memo(ProductCardInner);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  name: {
    ...TYPOGRAPHY.body2,
    marginTop: 8,
    height: 36,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    gap: 6,
  },
  price: {
    ...TYPOGRAPHY.price,
  },
  originalPrice: {
    ...TYPOGRAPHY.priceCrossed,
  },
  addBtn: {
    marginTop: 8,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
