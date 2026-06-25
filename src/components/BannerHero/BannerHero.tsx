import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, StyleSheet, Dimensions, View, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../context/ThemeContext';
import { handleAction } from '../../dispatcher/ActionDispatcher';
import { resolveImage } from '../../utils/imageResolver';
import type { BannerHeroNode, BannerItem } from '../../types/payload.types';
import { RADIUS, SPACING } from '../../styles/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = SCREEN_WIDTH - 32;
const BANNER_HEIGHT = 120; // Compact small rectangle height

interface Props {
  node: BannerHeroNode;
}

const BannerHeroInner: React.FC<Props> = ({ node }) => {
  const theme = useTheme();
  const flatListRef = useRef<FlatList<BannerItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const banners = node.banners || [];
  const hasMultipleBanners = banners.length > 1;

  // Auto-play scrolling mechanism
  useEffect(() => {
    if (!hasMultipleBanners) return;

    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex, banners.length, hasMultipleBanners]);

  const onMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CONTENT_WIDTH);
    if (index !== activeIndex && index >= 0 && index < banners.length) {
      setActiveIndex(index);
    }
  }, [activeIndex, banners.length]);

  const handleBannerPress = useCallback((action: any) => {
    if (action) {
      handleAction(action);
    }
  }, []);

  const renderBannerItem = useCallback(({ item }: { item: BannerItem }) => {
    const imageSource = resolveImage(item.image_url, item.local_image);
    return (
      <Pressable
        onPress={() => handleBannerPress(item.action)}
        style={styles.bannerSlide}
      >
        <Image
          source={imageSource}
          style={[styles.image, { borderRadius: RADIUS.radiusLarge }]}
          contentFit="cover"
        />
        
        {/* Text Overlay */}
        {(item.title || item.subtitle) && (
          <View style={[styles.textOverlay, { borderRadius: RADIUS.radiusLarge }]}>
            <View style={styles.textContainer}>
              {item.title && (
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
              )}
              {item.subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              )}
              {item.cta_label && (
                <View style={[styles.ctaButton, { backgroundColor: theme.primary, borderRadius: RADIUS.radiusFull }]}>
                  <Text style={styles.ctaText}>{item.cta_label}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Exclusive Badge */}
        {item.title && (
          <View style={[styles.badge, { borderRadius: RADIUS.radiusSmall }]}>
            <Text style={[styles.badgeText, { color: theme.textSecondary }]}>EXCLUSIVE</Text>
          </View>
        )}
      </Pressable>
    );
  }, [theme, handleBannerPress]);

  // Fallback to static single banner if no banners list is provided
  if (!hasMultipleBanners) {
    const singleNodeAction = node.action;
    const singleImageSource = resolveImage(node.image_url, node.local_image);
    return (
      <Pressable
        onPress={() => handleBannerPress(singleNodeAction)}
        style={({ pressed }) => [
          styles.container,
          {
            borderRadius: RADIUS.radiusLarge,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Image
          source={singleImageSource}
          style={[styles.image, { borderRadius: RADIUS.radiusLarge }]}
          contentFit="cover"
          transition={200}
        />
        {(node.title || node.subtitle) && (
          <View style={[styles.textOverlay, { borderRadius: RADIUS.radiusLarge }]}>
            <View style={styles.textContainer}>
              {node.title && <Text style={styles.title} numberOfLines={1}>{node.title}</Text>}
              {node.subtitle && <Text style={styles.subtitle} numberOfLines={1}>{node.subtitle}</Text>}
              {node.cta_label && (
                <View style={[styles.ctaButton, { backgroundColor: theme.primary, borderRadius: RADIUS.radiusFull }]}>
                  <Text style={styles.ctaText}>{node.cta_label}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBannerItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={styles.flatListContent}
        decelerationRate="fast"
        snapToInterval={CONTENT_WIDTH}
        snapToAlignment="center"
      />
      
      {/* Paging Indicators (Dots) */}
      <View style={styles.dotsRow}>
        {banners.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? theme.primary : 'rgba(255, 255, 255, 0.5)',
                  width: isActive ? 16 : 6,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export const BannerHero = memo(BannerHeroInner);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.space4,
    marginVertical: SPACING.space2,
    height: BANNER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  carouselContainer: {
    height: BANNER_HEIGHT,
    marginVertical: SPACING.space2,
    position: 'relative',
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  bannerSlide: {
    width: CONTENT_WIDTH,
    height: BANNER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  textContainer: {
    maxWidth: '75%',
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ctaButton: {
    height: 26,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    width: '100%',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
