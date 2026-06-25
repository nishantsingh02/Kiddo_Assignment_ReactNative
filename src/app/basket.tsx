import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCart, CartItem } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { resolveImage } from '../utils/imageResolver';
import { router } from 'expo-router';
import { RADIUS, SPACING } from '../styles/spacing';
import { TYPOGRAPHY } from '../styles/typography';

export default function BasketScreen() {
  const theme = useTheme();
  const { items, couponCode, couponDiscount, couponType, updateQuantity, removeItem, applyCoupon, clearCart, closeCart } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [promoAccordionOpen, setPromoAccordionOpen] = useState(false);

  const cartList = useMemo(() => Object.values(items), [items]);

  // Calculations
  const subtotal = useMemo(() => {
    return cartList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartList]);

  const discountAmount = useMemo(() => {
    if (!couponCode) return 0;
    if (couponType === 'percent') {
      return Math.round((subtotal * couponDiscount) / 100);
    } else if (couponType === 'flat') {
      return Math.min(subtotal, couponDiscount); // Cannot discount more than subtotal
    }
    return 0;
  }, [subtotal, couponCode, couponDiscount, couponType]);

  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    applyCoupon(promoInput.trim());
    setPromoInput('');
    alert(`Coupon "${promoInput.toUpperCase()}" applied successfully!`);
  };

  const handleCheckout = () => {
    if (cartList.length === 0) return;
    
    const successMsg = `🎉 Thank you for your purchase! Your order of ₹${grandTotal} has been placed. (Instant Delivery via Q-Commerce)`;
    
    if (Platform.OS === 'web') {
      alert(successMsg);
      clearCart();
      closeCart();
    } else {
      Alert.alert('Order Confirmed', successMsg, [
        {
          text: 'Back to Home',
          onPress: () => {
            clearCart();
            closeCart();
          },
        },
      ]);
    }
  };

  const handleGoBack = () => {
    closeCart();
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Pressable onPress={handleGoBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={theme.dark} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Basket</Text>
        <View style={styles.headerRight}>
          <Feather name="heart" size={20} color={theme.textSecondary} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cartList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.primaryLight }]}>
              <Feather name="shopping-bag" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Your basket is empty</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Browse our catalog of items and add some delicious snacks or toys.
            </Text>
            <Pressable
              onPress={handleGoBack}
              style={({ pressed }) => [
                styles.shopBtn,
                {
                  backgroundColor: theme.primary,
                  borderRadius: RADIUS.radiusFull,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={styles.shopBtnText}>Start Shopping</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cartSection}>
            {/* Cart Items List */}
            {cartList.map((item: CartItem) => {
              const imageSource = resolveImage(item.image_url, item.local_image);
              return (
                <View
                  key={item.id}
                  style={[
                    styles.cartCard,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      borderRadius: RADIUS.radiusMedium,
                    },
                  ]}
                >
                  <Image source={imageSource} style={styles.itemImage} contentFit="cover" />
                  
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, { color: theme.textPrimary }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.itemVariant, { color: theme.textSecondary }]}>
                      Standard Size | Q-Delivery
                    </Text>
                    <Text style={[styles.itemPrice, { color: theme.textPrimary }]}>
                      ₹{item.price}
                    </Text>
                  </View>

                  <View style={styles.actionColumn}>
                    <Pressable onPress={() => removeItem(item.id)} style={styles.deleteBtn}>
                      <Feather name="trash-2" size={18} color={theme.textSecondary} />
                    </Pressable>

                    <View style={[styles.stepper, { borderColor: theme.border, borderRadius: RADIUS.radiusSmall }]}>
                      <Pressable
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.stepUnit}
                      >
                        <Feather name="minus" size={14} color={theme.textPrimary} />
                      </Pressable>
                      <Text style={[styles.stepCount, { color: theme.textPrimary }]}>{item.quantity}</Text>
                      <Pressable
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.stepUnit}
                      >
                        <Feather name="plus" size={14} color={theme.textPrimary} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Promo Code Accordion */}
            <View style={[styles.accordionContainer, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: RADIUS.radiusMedium }]}>
              <Pressable
                onPress={() => setPromoAccordionOpen(!promoAccordionOpen)}
                style={styles.accordionHeader}
              >
                <View style={styles.promoHeaderTitle}>
                  <Feather name="tag" size={18} color={theme.primary} />
                  <Text style={[styles.accordionTitle, { color: theme.textPrimary }]}>
                    {couponCode ? `Coupon Applied: ${couponCode}` : 'Promo Code'}
                  </Text>
                </View>
                <Feather
                  name={promoAccordionOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>

              {promoAccordionOpen && (
                <View style={styles.accordionBody}>
                  <View style={[styles.promoInputRow, { borderColor: theme.border, borderRadius: RADIUS.radiusSmall }]}>
                    <TextInput
                      value={promoInput}
                      onChangeText={setPromoInput}
                      placeholder="Enter SALE20 or KIDDO100"
                      placeholderTextColor={theme.textDisabled}
                      autoCapitalize="characters"
                      style={[styles.promoInput, { color: theme.textPrimary }]}
                    />
                    <Pressable
                      onPress={handleApplyPromo}
                      style={[styles.promoApplyBtn, { backgroundColor: theme.primary, borderRadius: RADIUS.radiusSmall }]}
                    >
                      <Text style={styles.promoApplyText}>Apply</Text>
                    </Pressable>
                  </View>
                  <Text style={[styles.promoHint, { color: theme.textSecondary }]}>
                    Use coupon code <Text style={{ fontWeight: '700' }}>SALE20</Text> to get 20% discount or <Text style={{ fontWeight: '700' }}>KIDDO100</Text> to get flat ₹100 off.
                  </Text>
                </View>
              )}
            </View>

            {/* Billing Details */}
            <View style={[styles.billContainer, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: RADIUS.radiusMedium }]}>
              <Text style={[styles.billHeading, { color: theme.textPrimary }]}>Order Details</Text>
              
              <View style={styles.billRow}>
                <Text style={{ color: theme.textSecondary }}>Basket Subtotal</Text>
                <Text style={{ color: theme.textPrimary, fontWeight: '500' }}>₹{subtotal}</Text>
              </View>

              {couponCode && (
                <View style={styles.billRow}>
                  <Text style={{ color: theme.success }}>Promo Discount ({couponCode})</Text>
                  <Text style={{ color: theme.success, fontWeight: '500' }}>-₹{discountAmount}</Text>
                </View>
              )}

              <View style={styles.billRow}>
                <Text style={{ color: theme.textSecondary }}>Delivery Charges</Text>
                <Text style={{ color: theme.success, fontWeight: '700' }}>FREE</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.billRow}>
                <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total Amount</Text>
                <Text style={[styles.totalVal, { color: theme.textPrimary }]}>₹{grandTotal}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Checkout Button */}
      {cartList.length > 0 && (
        <View style={[styles.checkoutContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <Pressable
            onPress={handleCheckout}
            style={({ pressed }) => [
              styles.checkoutBtn,
              {
                backgroundColor: theme.primary,
                borderRadius: RADIUS.radiusFull,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={styles.checkoutBtnText}>Proceed to Payment • ₹{grandTotal}</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    zIndex: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    padding: 4,
  },
  scrollContent: {
    padding: SPACING.space4,
    paddingBottom: 120, // Clearance for fixed checkout button
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  shopBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  shopBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  cartSection: {
    gap: 16,
  },
  cartCard: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    height: 96,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.radiusMedium,
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    ...TYPOGRAPHY.body1,
    fontWeight: '700',
  },
  itemVariant: {
    ...TYPOGRAPHY.body2,
    marginTop: 2,
  },
  itemPrice: {
    ...TYPOGRAPHY.price,
    marginTop: 4,
  },
  actionColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 72,
  },
  deleteBtn: {
    padding: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 28,
    overflow: 'hidden',
  },
  stepUnit: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  stepCount: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
    textAlign: 'center',
  },
  accordionContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  promoHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  accordionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  promoInputRow: {
    flexDirection: 'row',
    borderWidth: 1,
    height: 40,
    alignItems: 'center',
    paddingLeft: 12,
    overflow: 'hidden',
  },
  promoInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  promoApplyBtn: {
    height: '100%',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoApplyText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  promoHint: {
    fontSize: 11,
    marginTop: 6,
    lineHeight: 14,
  },
  billContainer: {
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  billHeading: {
    ...TYPOGRAPHY.heading3,
    marginBottom: 4,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    borderTopWidth: 1,
    zIndex: 10,
  },
  checkoutBtn: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
