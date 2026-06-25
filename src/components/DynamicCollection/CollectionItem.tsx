import React, { memo, useState, useCallback } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { handleAction } from '../../dispatcher/ActionDispatcher';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { resolveImage } from '../../utils/imageResolver';
import type { CollectionItem as CollectionItemType } from '../../types/payload.types';
import { RADIUS, SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';

interface Props {
  item: CollectionItemType;
}

const CollectionItemInner: React.FC<Props> = ({ item }) => {
  const theme = useTheme();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const quantity = useCart((state) => state.quantities[item.id] ?? 0);

  const onPress = useCallback(() => {
    handleAction(item.action);
  }, [item.action]);

  const onAddToCart = useCallback(() => {
    if (item.add_to_cart_action) {
      handleAction(item.add_to_cart_action);
    } else {
      // Create fallback ADD_TO_CART action if payload didn't specify it explicitly
      handleAction({
        type: 'ADD_TO_CART',
        payload: {
          id: item.id,
          name: item.title,
          price: item.price ?? 99,
          image_url: item.image_url,
        },
      });
    }
  }, [item.add_to_cart_action, item.id, item.title, item.price, item.image_url]);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const imageSource = resolveImage(item.image_url, item.local_image);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: RADIUS.radiusMedium,
          opacity: pressed ? 0.95 : 1,
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
        
        {/* Wishlist Heart Icon */}
        <Pressable onPress={toggleWishlist} style={styles.wishlistBtn}>
          <Feather
            name="heart"
            size={20}
            color={isWishlisted ? theme.accent : theme.textDisabled}
            style={isWishlisted ? styles.heartActive : undefined}
          />
        </Pressable>
      </View>

      <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={2}>
        {item.title}
      </Text>

      {item.price !== undefined && (
        <Text style={[styles.price, { color: theme.textPrimary }]}>₹{item.price}</Text>
      )}

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

export const CollectionItem = memo(CollectionItemInner);

const styles = StyleSheet.create({
  card: {
    width: 156,
    padding: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  imageContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  heartActive: {
    textShadowColor: 'rgba(228, 184, 173, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    ...TYPOGRAPHY.body2,
    marginTop: 6,
    height: 36,
  },
  price: {
    ...TYPOGRAPHY.label,
    fontWeight: '700',
    marginTop: 2,
  },
  addBtn: {
    marginTop: 8,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
