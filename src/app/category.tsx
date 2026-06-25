import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { resolveImage } from '../utils/imageResolver';
import { AppHeader } from '../components/Header/AppHeader';
import { RADIUS, SPACING } from '../styles/spacing';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  badge?: string;
  local_image: string;
  category: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Products 🛍️' },
  { id: 'boys', label: 'Boys Wear 👕' },
  { id: 'girls', label: 'Girls Wear 👗' },
  { id: 'toys', label: 'Toys & Playhouse 🧸' },
  { id: 'gear', label: 'Baby Gear 🍼' },
  { id: 'books', label: 'Books 📚' },
  { id: 'snacks', label: 'Snacks & Food 🍎' },
];

const PRODUCTS: Product[] = [
  // Boys Wear
  {
    id: 'prod_boys_1',
    name: 'Classic Black Onesie Suit',
    price: 549,
    original_price: 799,
    badge: 'NEW',
    local_image: 'Black_1_10c0835a-b8c7-4431-b4e0-89272d392737.webp',
    category: 'boys',
  },
  {
    id: 'prod_boys_2',
    name: 'Winter Wonderland Sleepsuit',
    price: 499,
    original_price: 799,
    badge: 'SALE',
    local_image: 'baby-winter-wonderland-sleepsuit-onesie_2_aa0gaa.webp',
    category: 'boys',
  },
  {
    id: 'prod_boys_3',
    name: 'Premium Denim Jumpsuit',
    price: 950,
    original_price: 1200,
    badge: 'HOT',
    local_image: 'Screenshot_2026-04-10_124132_lyoa5u.webp',
    category: 'boys',
  },
  {
    id: 'prod_boys_4',
    name: 'Warm Fleece Hooded Suit',
    price: 600,
    original_price: 850,
    badge: 'BEST',
    local_image: 'WhatsApp_Image_2026-03-08_at_11.26.09_PM_0f0e04e9-d51f-4dd3-a7f5-5afa74d96096.webp',
    category: 'boys',
  },

  // Girls Wear
  {
    id: 'prod_girls_1',
    name: 'Pastel Knitted Sweater',
    price: 799,
    original_price: 999,
    badge: 'HOT',
    local_image: '01_6_396d76c1-6654-44b3-b739-e67c316202e1.webp',
    category: 'girls',
  },
  {
    id: 'prod_girls_2',
    name: 'Knitted Baby Jumper',
    price: 890,
    original_price: 1100,
    badge: 'NEW',
    local_image: 'Front_00f9f081-a3b8-43b7-b833-9abe9c95f814.webp',
    category: 'girls',
  },
  {
    id: 'prod_girls_3',
    name: 'Cotton Knit Sleepwear',
    price: 799,
    original_price: 1099,
    badge: 'SALE',
    local_image: 'ad46eff2-cfe7-4cf6-923a-411f3a8a4ff9_full.webp',
    category: 'girls',
  },
  {
    id: 'prod_girls_4',
    name: 'Lovely Coord Ruffled Set',
    price: 699,
    original_price: 950,
    badge: 'CUTE',
    local_image: 'App_designs_500_x_600_mm_1_cd17998f-1e9b-4120-af77-eb2bd1a59b8a.webp',
    category: 'girls',
  },

  // Toys & Playhouse
  {
    id: 'prod_toys_1',
    name: 'Infant Teething Toy Ring',
    price: 180,
    badge: 'SOFT',
    local_image: '41Fr0hXWn6L.jpg',
    category: 'toys',
  },
  {
    id: 'prod_toys_2',
    name: 'Toddler Wooden Blocks',
    price: 599,
    original_price: 799,
    badge: 'LEARN',
    local_image: '71Fb39HZ5XL._SL1500.webp',
    category: 'toys',
  },
  {
    id: 'prod_toys_3',
    name: 'Interactive Play Mat & Gym',
    price: 1299,
    original_price: 1699,
    badge: 'FUN',
    local_image: '51RBBJY0ZFL._SL1080_b0d5a0a8-377f-498d-aac4-0189af15865e.webp',
    category: 'toys',
  },
  {
    id: 'prod_toys_4',
    name: 'Plush Teddy Bear Friend',
    price: 399,
    badge: 'SOFT',
    local_image: 'OIP.jpg',
    category: 'toys',
  },

  // Baby Gear
  {
    id: 'prod_gear_1',
    name: 'Premium Compact Stroller',
    price: 4500,
    original_price: 5999,
    badge: 'SAFETY',
    local_image: 'Baby_Gear_Main_Banner.webp',
    category: 'gear',
  },
  {
    id: 'prod_gear_2',
    name: 'Safety Baby Car Seat',
    price: 3200,
    original_price: 3999,
    badge: 'SAFETY',
    local_image: 'WhatsApp_Image_2026-03-08_at_11.26.09_PM_0f0e04e9-d51f-4dd3-a7f5-5afa74d96096.webp',
    category: 'gear',
  },

  // Books
  {
    id: 'prod_books_1',
    name: 'Illustrated Nursery Rhymes',
    price: 299,
    original_price: 399,
    badge: 'STORY',
    local_image: 'Books_Main_Banner.webp',
    category: 'books',
  },
  {
    id: 'prod_books_2',
    name: 'Early Learning Board Book',
    price: 499,
    original_price: 599,
    badge: 'LEARN',
    local_image: '41Fr0hXWn6L.jpg',
    category: 'books',
  },

  // Snacks
  {
    id: 'prod_snacks_1',
    name: 'Organic Apple Banana Puree',
    price: 120,
    badge: 'YUMMY',
    local_image: 'OIP.jpg',
    category: 'snacks',
  },
  {
    id: 'prod_snacks_2',
    name: 'Strawberry Fruit Puffs Pack',
    price: 150,
    badge: 'ORGANIC',
    local_image: 'OIP.jpg',
    category: 'snacks',
  },
];

export default function CategoryScreen() {
  const theme = useTheme();
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddOne = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      local_image: product.local_image,
    });
  };

  const handleSubtractOne = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty - 1);
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const cartItem = cartItems[item.id];
    const qty = cartItem ? cartItem.quantity : 0;
    const isWished = !!wishlist[item.id];

    return (
      <View style={[styles.productCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {/* Top Badges / Wishlist */}
        <View style={styles.cardHeader}>
          {item.badge ? (
            <View style={[styles.badgeContainer, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>{item.badge}</Text>
            </View>
          ) : (
            <View />
          )}

          <Pressable onPress={() => toggleWishlist(item.id)} style={styles.wishlistBtn}>
            <Ionicons
              name={isWished ? 'heart' : 'heart-outline'}
              size={20}
              color={isWished ? theme.error : theme.textSecondary}
            />
          </Pressable>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={resolveImage(undefined, item.local_image)}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productDetails}>
          <Text style={[styles.productName, { color: theme.textPrimary }]} numberOfLines={2}>
            {item.name}
          </Text>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={[styles.priceText, { color: theme.primary }]}>₹{item.price}</Text>
            {item.original_price && (
              <Text style={[styles.originalPriceText, { color: theme.textSecondary }]}>
                ₹{item.original_price}
              </Text>
            )}
          </View>

          {/* Add / Qty Actions */}
          <View style={styles.actionRow}>
            {qty > 0 ? (
              <View style={[styles.qtySelector, { borderColor: theme.primary, backgroundColor: theme.primaryLight }]}>
                <Pressable onPress={() => handleSubtractOne(item.id, qty)} style={styles.qtyBtn}>
                  <Feather name="minus" size={14} color={theme.primary} />
                </Pressable>
                <Text style={[styles.qtyText, { color: theme.primary }]}>{qty}</Text>
                <Pressable onPress={() => handleAddOne(item)} style={styles.qtyBtn}>
                  <Feather name="plus" size={14} color={theme.primary} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => handleAddOne(item)}
                style={[styles.addBtn, { backgroundColor: theme.primary }]}
              >
                <Feather name="shopping-bag" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.addBtnText}>+ Add</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <AppHeader />

      {/* Search and Header Intro */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBarContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Feather name="search" size={18} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search kids products..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Feather name="x" size={16} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Side-Scrolling Category Chips */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.surface,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Dynamic Products Grid */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.listRow}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="basket-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyStateTitle, { color: theme.textPrimary }]}>No Products Found</Text>
          <Text style={[styles.emptyStateSub, { color: theme.textSecondary }]}>
            Try switching categories or modifying your search query.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 40) / 2; // Responsive 2 column card width

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderRadius: RADIUS.radiusMedium,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    padding: 0, // Removes OS default padding
  },
  clearBtn: {
    padding: 4,
  },
  categoriesWrapper: {
    paddingVertical: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipText: {
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'web' ? 120 : 60,
  },
  listRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: cardWidth,
    borderWidth: 1,
    borderRadius: RADIUS.radiusMedium,
    marginHorizontal: 4,
    marginBottom: 12,
    padding: 8,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 22,
  },
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  wishlistBtn: {
    padding: 2,
  },
  imageContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  productImage: {
    width: '90%',
    height: '100%',
  },
  productDetails: {
    marginTop: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    height: 36,
    lineHeight: 18,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
  },
  originalPriceText: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  actionRow: {
    height: 32,
    justifyContent: 'center',
  },
  addBtn: {
    height: 32,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  qtySelector: {
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
