import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useTheme } from '../context/ThemeContext';
import { Spacing } from '@/constants/theme';
import { useCart } from '../context/CartContext';

export default function AppTabs() {
  return (
    <Tabs style={{ flex: 1 }}>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="category" href="/category" asChild>
            <TabButton>Category</TabButton>
          </TabTrigger>
          <TabTrigger name="ticket" href="/ticket" asChild>
            <TabButton>Ticket</TabButton>
          </TabTrigger>
          <TabTrigger name="account" href="/account" asChild>
            <TabButton>Account</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const theme = useTheme();
  const totalCount = useCart((state) => state.totalCount);

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        style={[
          styles.tabButtonView,
          {
            backgroundColor: isFocused ? theme.primaryLight : 'transparent',
          },
        ]}
      >
        <View style={styles.tabButtonContent}>
          <Text
            style={{
              color: isFocused ? theme.primary : theme.textSecondary,
              fontWeight: isFocused ? '700' : '500',
              fontSize: 13,
            }}
          >
            {children}
          </Text>
          {children === 'Basket' && totalCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.error }]}>
              <Text style={styles.badgeText}>{totalCount}</Text>
            </View>
          )}
        </View>
      </ThemedView>
    </Pressable>
  );
}

// We define a simple custom Text element to override style warnings
import { Text } from 'react-native';

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();

  return (
    <View {...props} style={[styles.tabListContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      <View style={styles.innerContainer}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 100,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 600,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
