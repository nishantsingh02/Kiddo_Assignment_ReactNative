import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/Header/AppHeader';
import { RADIUS, SPACING } from '../styles/spacing';

interface UserProfile {
  name: string;
  email: string;
  loyaltyPoints: number;
  avatar: string;
}

interface OrderRecord {
  id: string;
  date: string;
  items: string;
  total: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
}

const MOCK_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-984210',
    date: 'June 20, 2026',
    items: 'Winter Wonderland Sleepsuit (x1), Pastel Knitted Sweater (x1)',
    total: 1298,
    status: 'Delivered',
  },
  {
    id: 'ORD-871239',
    date: 'May 12, 2026',
    items: 'Infant Teething Toy Ring (x2), Toddler Wooden Blocks (x1)',
    total: 959,
    status: 'Delivered',
  },
  {
    id: 'ORD-752109',
    date: 'June 24, 2026',
    items: 'Kids Pool & Swimming Session Ticket (x2)',
    total: 998,
    status: 'In Transit',
  },
];

export default function AccountScreen() {
  const theme = useTheme();
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Form states
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleAuthAction = () => {
    setFormError('');
    if (!email || !password || (isSignUp && !name)) {
      setFormError('Please fill out all required fields.');
      return;
    }
    
    if (!email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    // Simulate login / signup
    setUserProfile({
      name: isSignUp ? name : email.split('@')[0],
      email: email,
      loyaltyPoints: 320,
      avatar: '👶',
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setName('');
    setEmail('');
    setPassword('');
    setFormError('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoggedIn && userProfile ? (
          /* Profile / User State Dashboard */
          <View style={styles.dashboardWrapper}>
            
            {/* User Header Profile Card */}
            <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.avatarCircle, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.avatarText}>{userProfile.avatar}</Text>
              </View>
              <View style={styles.profileMeta}>
                <Text style={[styles.profileName, { color: theme.textPrimary }]}>{userProfile.name}</Text>
                <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{userProfile.email}</Text>
              </View>
              <Pressable onPress={handleLogout} style={styles.logoutIconBtn}>
                <Feather name="log-out" size={20} color={theme.error} />
              </Pressable>
            </View>

            {/* Q-Loyalty Rewards Progress Card */}
            <View style={[styles.loyaltyCard, { backgroundColor: theme.primaryLight }]}>
              <View style={styles.loyaltyHeader}>
                <Text style={[styles.loyaltyTitle, { color: theme.primary }]}>🏆 Kiddo Loyalty Club</Text>
                <Text style={[styles.loyaltyPoints, { color: theme.primary }]}>{userProfile.loyaltyPoints} Points</Text>
              </View>
              <Text style={[styles.loyaltyDesc, { color: theme.textSecondary }]}>
                You are 180 points away from unlocking a ₹500 store coupon!
              </Text>
              <View style={[styles.progressBarBg, { backgroundColor: theme.surface }]}>
                <View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: '64%' }]} />
              </View>
              <View style={styles.loyaltyFooter}>
                <Text style={[styles.loyaltyFooterText, { color: theme.textSecondary }]}>Level: Spark Explorer 🌟</Text>
                <Text style={[styles.loyaltyFooterText, { color: theme.textSecondary }]}>64% Completed</Text>
              </View>
            </View>

            {/* Quick Actions Grid */}
            <View style={styles.actionsGrid}>
              <Pressable style={[styles.gridActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="location-outline" size={24} color={theme.primary} />
                <Text style={[styles.actionCardTitle, { color: theme.textPrimary }]}>Addresses</Text>
              </Pressable>
              <Pressable style={[styles.gridActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="card-outline" size={24} color={theme.primary} />
                <Text style={[styles.actionCardTitle, { color: theme.textPrimary }]}>Payments</Text>
              </Pressable>
              <Pressable style={[styles.gridActionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="help-buoy-outline" size={24} color={theme.primary} />
                <Text style={[styles.actionCardTitle, { color: theme.textPrimary }]}>Support</Text>
              </Pressable>
            </View>

            {/* Order History */}
            <View style={styles.ordersSection}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>📦 Order & Activity History</Text>
              {MOCK_ORDERS.map((order) => (
                <View
                  key={order.id}
                  style={[
                    styles.orderCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.orderCardHeader}>
                    <Text style={[styles.orderId, { color: theme.textPrimary }]}>{order.id}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            order.status === 'Delivered'
                              ? theme.success + '15'
                              : order.status === 'In Transit'
                              ? theme.warning + '15'
                              : theme.primary + '15',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          {
                            color:
                              order.status === 'Delivered'
                                ? theme.success
                                : order.status === 'In Transit'
                                ? theme.warning
                                : theme.primary,
                          },
                        ]}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.orderDate, { color: theme.textSecondary }]}>{order.date}</Text>
                  <Text style={[styles.orderItems, { color: theme.textSecondary }]} numberOfLines={2}>
                    {order.items}
                  </Text>
                  <View style={[styles.orderDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.orderFooter}>
                    <Text style={[styles.orderTotalLabel, { color: theme.textSecondary }]}>Total Amount</Text>
                    <Text style={[styles.orderTotalVal, { color: theme.textPrimary }]}>₹{order.total}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          /* Authentication / Guest Form State */
          <View style={styles.authWrapper}>
            <View style={styles.brandIntro}>
              <Text style={styles.brandEmoji}>🍼</Text>
              <Text style={[styles.brandHeader, { color: theme.textPrimary }]}>Welcome to Kiddo Store</Text>
              <Text style={[styles.brandSub, { color: theme.textSecondary }]}>
                Join today to track orders, save wishlists, and earn exclusive birthday reward stamps!
              </Text>
            </View>

            <View style={[styles.authForm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.formTitle, { color: theme.textPrimary }]}>
                {isSignUp ? 'Create Free Account' : 'Log In Account'}
              </Text>

              {formError ? (
                <View style={[styles.errorBox, { backgroundColor: theme.error + '10', borderColor: theme.error }]}>
                  <Feather name="alert-circle" size={16} color={theme.error} style={{ marginRight: 6 }} />
                  <Text style={[styles.errorText, { color: theme.error }]}>{formError}</Text>
                </View>
              ) : null}

              {isSignUp && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
                  <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
                    <Feather name="user" size={18} color={theme.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      placeholder="Enter full name"
                      placeholderTextColor={theme.textSecondary}
                      value={name}
                      onChangeText={setName}
                      style={[styles.input, { color: theme.textPrimary }]}
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email Address</Text>
                <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
                  <Feather name="mail" size={18} color={theme.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    placeholder="name@example.com"
                    placeholderTextColor={theme.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, { color: theme.textPrimary }]}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Password</Text>
                <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
                  <Feather name="lock" size={18} color={theme.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor={theme.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[styles.input, { color: theme.textPrimary }]}
                  />
                </View>
              </View>

              <Pressable
                onPress={handleAuthAction}
                style={[styles.submitBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.submitBtnText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
              </Pressable>

              <View style={styles.toggleRow}>
                <Text style={[styles.toggleText, { color: theme.textSecondary }]}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </Text>
                <Pressable onPress={() => { setIsSignUp(!isSignUp); setFormError(''); }}>
                  <Text style={[styles.toggleAction, { color: theme.primary }]}>
                    {isSignUp ? 'Log In' : 'Sign Up Free'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'web' ? 120 : 60,
  },
  
  // Auth Form Styles
  authWrapper: {
    padding: 24,
    alignItems: 'center',
  },
  brandIntro: {
    alignItems: 'center',
    marginBottom: 24,
    textAlign: 'center',
  },
  brandEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  brandHeader: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  brandSub: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  authForm: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderRadius: RADIUS.radiusLarge,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.radiusSmall,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderRadius: RADIUS.radiusMedium,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
  submitBtn: {
    height: 46,
    borderRadius: RADIUS.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  toggleText: {
    fontSize: 12,
  },
  toggleAction: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Logged In Dashboard Styles
  dashboardWrapper: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: RADIUS.radiusLarge,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
  },
  logoutIconBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  loyaltyCard: {
    padding: 16,
    borderRadius: RADIUS.radiusLarge,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  loyaltyTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  loyaltyPoints: {
    fontSize: 14,
    fontWeight: '800',
  },
  loyaltyDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  loyaltyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loyaltyFooterText: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  gridActionCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RADIUS.radiusMedium,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionCardTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  ordersSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  orderCard: {
    borderWidth: 1,
    borderRadius: RADIUS.radiusLarge,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 11,
    marginBottom: 8,
  },
  orderItems: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  orderDivider: {
    height: 1.5,
    width: '100%',
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderTotalVal: {
    fontSize: 14,
    fontWeight: '700',
  },
});
