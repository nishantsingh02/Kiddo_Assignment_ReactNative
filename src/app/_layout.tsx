import React from 'react';
import { useColorScheme, View, StyleSheet, Modal } from 'react-native';
import { CampaignProvider, useCampaign } from '../context/CampaignContext';
import { ThemeProvider } from '../context/ThemeContext';
import { DrawerProvider } from '../context/DrawerContext';
import AppTabs from '../components/app-tabs';
import { AnimatedSplashOverlay } from '../components/animated-icon';
import { SideDrawer } from '../components/Drawer/SideDrawer';
import BasketScreen from './basket';
import { useCart } from '../context/CartContext';

// A wrapper container that subscribes to the active campaign theme
// and injects it into our custom ThemeProvider context.
function ThemedAppContainer() {
  const { activePayload } = useCampaign();
  const theme = activePayload.theme;
  const isCartOpen = useCart((state) => state.isCartOpen);

  return (
    <ThemeProvider theme={theme}>
      <DrawerProvider>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <AnimatedSplashOverlay />
          <AppTabs />
          <SideDrawer />
          <Modal visible={isCartOpen} animationType="slide" transparent={false}>
            <BasketScreen />
          </Modal>
        </View>
      </DrawerProvider>
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <CampaignProvider>
      <ThemedAppContainer />
    </CampaignProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
