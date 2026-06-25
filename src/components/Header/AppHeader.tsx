import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useDrawer } from '../../context/DrawerContext';
import { router } from 'expo-router';

interface AppHeaderProps {
  showBackButton?: boolean;
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ showBackButton = false, title }) => {
  const theme = useTheme();
  const { openDrawer } = useDrawer();
  // Surgical subscription to cart count
  const totalCount = useCart((state) => state.totalCount);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Scale animation whenever the cart count changes
  useEffect(() => {
    if (totalCount > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [totalCount]);

  const handleMenuPress = () => {
    openDrawer();
  };

  const openCart = useCart((state) => state.openCart);

  const handleCartPress = () => {
    openCart();
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <View style={styles.leftSection}>
        {showBackButton ? (
          <Pressable onPress={handleBackPress} style={styles.iconButton}>
            <Feather name="arrow-left" size={24} color={theme.dark} />
          </Pressable>
        ) : (
          <Pressable onPress={handleMenuPress} style={styles.iconButton}>
            <Feather name="menu" size={24} color={theme.dark} />
          </Pressable>
        )}
      </View>

      <View style={styles.centerSection}>
        {title ? (
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
        ) : (
          <View style={styles.locationContainer}>
            <Image
              source={require('../../assets/photos/OIP.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.locationDetails}>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={theme.error} />
                <Text style={[styles.locationText, { color: theme.textSecondary }]}>Noida - IND</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        <Pressable onPress={handleCartPress} style={styles.iconButton}>
          <Feather name="shopping-bag" size={24} color={theme.dark} />
          {totalCount > 0 && (
            <Animated.View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.error,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.badgeText}>{totalCount}</Text>
            </Animated.View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    zIndex: 10,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  locationDetails: {
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
