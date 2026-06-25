import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Modal, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { AppHeader } from '../components/Header/AppHeader';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { FilterChips } from '../components/FilterChips/FilterChips';
import { HomeFeedRenderer } from '../engine/HomeFeedRenderer';
import { CampaignOverlay } from '../campaigns/CampaignOverlay';
import { useCampaign } from '../context/CampaignContext';
import { useTheme } from '../context/ThemeContext';
import type { CampaignId } from '../types/campaign.types';
import { RADIUS, SPACING } from '../styles/spacing';

export default function HomeScreen() {
  const { activePayload, activeCampaignId, setCampaign } = useCampaign();
  const theme = useTheme();
  const [isDevMenuVisible, setIsDevMenuVisible] = useState(false);

  const handleSelectCampaign = (id: CampaignId | null) => {
    setCampaign(id);
    setIsDevMenuVisible(false);
  };

  const getCampaignName = () => {
    switch (activeCampaignId) {
      case 'BACK_TO_SCHOOL':
        return 'Back to School Mega-Sale';
      case 'SUMMER_PLAYHOUSE':
        return 'Summer Playhouse Festival';
      case 'MYSTERY_CARNIVAL':
        return 'Mystery Gift Carnival';
      default:
        return 'Default Feed';
    }
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      {/* Dynamic Overlay Particles Layer */}
      <CampaignOverlay
        campaignId={activeCampaignId}
        overlay={activePayload.campaign?.overlay ?? null}
      />

      <View style={styles.content}>
        {/* App Header (contains location, logo, and cart badge) */}
        <AppHeader />

        {/* Pill Search Bar */}
        <SearchBar />

        {/* Horizontal filter chips */}
        <FilterChips />

        {/* Dynamic Feed scroll container */}
        <View style={styles.feedWrapper}>
          <HomeFeedRenderer sections={activePayload.sections} />
        </View>
      </View>

      {/* Floating SDUI Dev Simulator Trigger */}
      <Pressable
        onPress={() => setIsDevMenuVisible(true)}
        style={[
          styles.fab,
          {
            backgroundColor: theme.primary,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 5,
          },
        ]}
      >
        <Feather name="sliders" size={20} color="#FFFFFF" />
        <Text style={styles.fabText}>SDUI Demo</Text>
      </Pressable>

      {/* Campaign Switcher Modal */}
      <Modal
        visible={isDevMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDevMenuVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsDevMenuVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                ⚙️ SDUI Campaign Controller
              </Text>
              <Pressable onPress={() => setIsDevMenuVisible(false)} style={styles.closeBtn}>
                <Feather name="x" size={22} color={theme.textSecondary} />
              </Pressable>
            </View>

            <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
              Simulate OTA (Over-The-Air) backend theme injection, dynamic grid restructures, and touch-transparent overlay campaigns.
            </Text>

            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>Active Campaign:</Text>
              <Text style={[styles.statusVal, { color: theme.primary }]}>{getCampaignName()}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.campaignList}>
              {/* Default Theme */}
              <Pressable
                onPress={() => handleSelectCampaign(null)}
                style={[
                  styles.campaignOption,
                  {
                    borderColor: activeCampaignId === null ? theme.primary : theme.border,
                    backgroundColor: activeCampaignId === null ? theme.primaryLight : 'transparent',
                    borderRadius: RADIUS.radiusMedium,
                  },
                ]}
              >
                <View style={styles.campaignMeta}>
                  <Text style={[styles.campaignOptTitle, { color: theme.textPrimary }]}>🏠 Default Q-Commerce</Text>
                  <Text style={[styles.campaignOptDesc, { color: theme.textSecondary }]}>Teal theme, standard homepage grid structure.</Text>
                </View>
              </Pressable>

              {/* Back to School */}
              <Pressable
                onPress={() => handleSelectCampaign('BACK_TO_SCHOOL')}
                style={[
                  styles.campaignOption,
                  {
                    borderColor: activeCampaignId === 'BACK_TO_SCHOOL' ? theme.primary : theme.border,
                    backgroundColor: activeCampaignId === 'BACK_TO_SCHOOL' ? theme.primaryLight : 'transparent',
                    borderRadius: RADIUS.radiusMedium,
                  },
                ]}
              >
                <View style={styles.campaignMeta}>
                  <Text style={[styles.campaignOptTitle, { color: theme.textPrimary }]}>🎒 Back to School Mega-Sale</Text>
                  <Text style={[styles.campaignOptDesc, { color: theme.textSecondary }]}>Deep blue/yellow theme, paper airplanes overlay.</Text>
                </View>
              </Pressable>

              {/* Summer Playhouse */}
              <Pressable
                onPress={() => handleSelectCampaign('SUMMER_PLAYHOUSE')}
                style={[
                  styles.campaignOption,
                  {
                    borderColor: activeCampaignId === 'SUMMER_PLAYHOUSE' ? theme.primary : theme.border,
                    backgroundColor: activeCampaignId === 'SUMMER_PLAYHOUSE' ? theme.primaryLight : 'transparent',
                    borderRadius: RADIUS.radiusMedium,
                  },
                ]}
              >
                <View style={styles.campaignMeta}>
                  <Text style={[styles.campaignOptTitle, { color: theme.textPrimary }]}>🏖️ Summer Playhouse Festival</Text>
                  <Text style={[styles.campaignOptDesc, { color: theme.textSecondary }]}>Ocean teal theme, floating water bubbles overlay.</Text>
                </View>
              </Pressable>

              {/* Mystery Carnival */}
              <Pressable
                onPress={() => handleSelectCampaign('MYSTERY_CARNIVAL')}
                style={[
                  styles.campaignOption,
                  {
                    borderColor: activeCampaignId === 'MYSTERY_CARNIVAL' ? theme.primary : theme.border,
                    backgroundColor: activeCampaignId === 'MYSTERY_CARNIVAL' ? theme.primaryLight : 'transparent',
                    borderRadius: RADIUS.radiusMedium,
                  },
                ]}
              >
                <View style={styles.campaignMeta}>
                  <Text style={[styles.campaignOptTitle, { color: theme.textPrimary }]}>🎪 Mystery Gift Carnival</Text>
                  <Text style={[styles.campaignOptDesc, { color: theme.textSecondary }]}>Carnival red theme, spinning falling confetti overlay.</Text>
                </View>
              </Pressable>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  feedWrapper: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 61.5 : 52, // 0.5px gap from the web tab bar / native tab bar height
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 90,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: RADIUS.radiusLarge,
    borderTopRightRadius: RADIUS.radiusLarge,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  campaignList: {
    gap: 12,
    paddingBottom: 20,
  },
  campaignOption: {
    borderWidth: 2,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  campaignMeta: {
    flex: 1,
  },
  campaignOptTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  campaignOptDesc: {
    fontSize: 12,
  },
});
