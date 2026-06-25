import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { resolveImage } from '../utils/imageResolver';
import { AppHeader } from '../components/Header/AppHeader';
import { RADIUS, SPACING } from '../styles/spacing';

interface EventActivity {
  id: string;
  title: string;
  emoji: string;
  description: string;
  duration: string;
  ageGroup: string;
  price: number;
  initialSlots: number;
  localImage: string;
}

const EVENTS: EventActivity[] = [
  {
    id: 'evt_swimming',
    title: 'Kids Pool & Swimming Session',
    emoji: '🏊',
    description: 'Water safety training, bubble blowing, and guided free-play in our heated kids splash pool. Managed by certified lifeguards.',
    duration: '90 Minutes',
    ageGroup: '3 to 10 Years',
    price: 499,
    initialSlots: 8,
    localImage: '187Q0MR-lT1ZE8TIQUTM69vAuXDPxma3c_w1000_a5713258-5bf0-479f-91d1-a3d5b43cfebf.webp',
  },
  {
    id: 'evt_petting_zoo',
    title: 'Petting Zoo & Playhouse Entry',
    emoji: '🐐',
    description: 'Feed friendly dwarf goats, rabbits, and sheep. Includes full day entry to the slide fortress, obstacle tunnels, and ball pit.',
    duration: 'Full Day Pass',
    ageGroup: '1 to 12 Years',
    price: 799,
    initialSlots: 15,
    localImage: 'Blog_Illustration_17.webp',
  },
  {
    id: 'evt_obstacle_course',
    title: 'Adventure Obstacle Course',
    emoji: '🧗',
    description: 'Mini climbing wall, speed dashes, crawling net tunnels, and balance rope beams. Encourages coordination and agility.',
    duration: '60 Minutes',
    ageGroup: '5 to 14 Years',
    price: 599,
    initialSlots: 5,
    localImage: 'App_designs_500_x_600_mm_1_cd17998f-1e9b-4120-af77-eb2bd1a59b8a (1).webp',
  },
];

interface BookingState {
  eventId: string;
  bookingId: string;
  slotsBooked: number;
  timestamp: string;
}

export default function TicketScreen() {
  const theme = useTheme();
  const [slotsLeft, setSlotsLeft] = useState<Record<string, number>>({
    evt_swimming: 8,
    evt_petting_zoo: 15,
    evt_obstacle_course: 5,
  });
  const [activeBookings, setActiveBookings] = useState<Record<string, BookingState>>({});
  const [viewingTicketId, setViewingTicketId] = useState<string | null>(null);

  const handleBookTicket = (event: EventActivity) => {
    const currentSlots = slotsLeft[event.id];
    if (currentSlots <= 0) return;

    // Decrease slot count
    setSlotsLeft((prev) => ({
      ...prev,
      [event.id]: prev[event.id] - 1,
    }));

    // Create booking
    const bId = 'KDO-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking: BookingState = {
      eventId: event.id,
      bookingId: bId,
      slotsBooked: (activeBookings[event.id]?.slotsBooked ?? 0) + 1,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setActiveBookings((prev) => ({
      ...prev,
      [event.id]: newBooking,
    }));

    setViewingTicketId(event.id);
  };

  const getActiveBooking = (eventId: string) => activeBookings[eventId];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        <View style={[styles.introSection, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.introTitle, { color: theme.primary }]}>🎪 Kids Activity Center</Text>
          <Text style={[styles.introDesc, { color: theme.textSecondary }]}>
            Book physical sessions, swimming lessons, and play passes for your little ones. Active bodies, happy minds!
          </Text>
        </View>

        {/* Tickets Feed */}
        <View style={styles.eventsWrapper}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Available Activities</Text>
          
          {EVENTS.map((event) => {
            const currentSlots = slotsLeft[event.id];
            const booking = getActiveBooking(event.id);
            const isSoldOut = currentSlots <= 0;
            const isBooked = !!booking;

            return (
              <View
                key={event.id}
                style={[
                  styles.eventCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                {/* Event Image */}
                <Image
                  source={resolveImage(undefined, event.localImage)}
                  style={styles.eventImage}
                  resizeMode="cover"
                />

                {/* Badge Overlay */}
                <View style={styles.badgeOverlay}>
                  {isSoldOut ? (
                    <View style={[styles.badgeContainer, { backgroundColor: theme.error }]}>
                      <Text style={styles.badgeText}>SOLD OUT</Text>
                    </View>
                  ) : currentSlots <= 5 ? (
                    <View style={[styles.badgeContainer, { backgroundColor: theme.warning }]}>
                      <Text style={styles.badgeText}>ONLY {currentSlots} LEFT!</Text>
                    </View>
                  ) : (
                    <View style={[styles.badgeContainer, { backgroundColor: theme.success }]}>
                      <Text style={styles.badgeText}>SLOTS OPEN</Text>
                    </View>
                  )}
                </View>

                {/* Event Info */}
                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.eventTitle, { color: theme.textPrimary }]}>
                      {event.emoji} {event.title}
                    </Text>
                  </View>

                  <Text style={[styles.eventDesc, { color: theme.textSecondary }]}>
                    {event.description}
                  </Text>

                  {/* Metadata Row */}
                  <View style={styles.metaRow}>
                    <View style={[styles.metaChip, { backgroundColor: theme.background }]}>
                      <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>{event.duration}</Text>
                    </View>
                    <View style={[styles.metaChip, { backgroundColor: theme.background }]}>
                      <Ionicons name="people-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>{event.ageGroup}</Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />

                  {/* Actions & Price */}
                  <View style={styles.actionRow}>
                    <View>
                      <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Ticket Price</Text>
                      <Text style={[styles.priceVal, { color: theme.primary }]}>₹{event.price}</Text>
                    </View>

                    {isBooked ? (
                      <View style={styles.bookingActionBlock}>
                        <Pressable
                          onPress={() => setViewingTicketId(event.id)}
                          style={[styles.viewTicketBtn, { borderColor: theme.primary }]}
                        >
                          <Ionicons name="ticket" size={14} color={theme.primary} style={{ marginRight: 4 }} />
                          <Text style={[styles.viewTicketText, { color: theme.primary }]}>View Ticket</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handleBookTicket(event)}
                          disabled={isSoldOut}
                          style={[
                            styles.bookBtnSmall,
                            { backgroundColor: isSoldOut ? theme.textDisabled : theme.primaryLight },
                          ]}
                        >
                          <Text style={[styles.bookBtnSmallText, { color: isSoldOut ? '#FFFFFF' : theme.primary }]}>
                            Book Another (+{booking.slotsBooked})
                          </Text>
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => handleBookTicket(event)}
                        disabled={isSoldOut}
                        style={[
                          styles.bookBtn,
                          { backgroundColor: isSoldOut ? theme.textDisabled : theme.primary },
                        ]}
                      >
                        <Text style={styles.bookBtnText}>{isSoldOut ? 'Sold Out' : 'Book Session'}</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Modal Ticket Pass */}
        {viewingTicketId && (
          <View style={styles.ticketModalOverlay}>
            <View style={[styles.ticketPassCard, { backgroundColor: theme.surface }]}>
              {/* Ticket Top Cutouts */}
              <View style={[styles.ticketTopRow, { backgroundColor: theme.primary }]}>
                <Text style={styles.passHeaderTitle}>⭐ KIDDO PASS ⭐</Text>
                <Pressable onPress={() => setViewingTicketId(null)} style={styles.closePassBtn}>
                  <Feather name="x" size={20} color="#FFFFFF" />
                </Pressable>
              </View>

              {/* Ticket Details */}
              <View style={styles.passBody}>
                {(() => {
                  const event = EVENTS.find((e) => e.id === viewingTicketId);
                  const booking = getActiveBooking(viewingTicketId);
                  if (!event || !booking) return null;

                  return (
                    <>
                      <Text style={[styles.passEventTitle, { color: theme.primary }]}>
                        {event.title}
                      </Text>
                      <View style={[styles.ticketDetailsGrid, { borderColor: theme.border }]}>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>BOOKING ID</Text>
                          <Text style={[styles.gridValue, { color: theme.textPrimary }]}>{booking.bookingId}</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>QUANTITY</Text>
                          <Text style={[styles.gridValue, { color: theme.textPrimary }]}>
                            {booking.slotsBooked} Child{booking.slotsBooked > 1 ? 'ren' : ''}
                          </Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>DATE & TIME</Text>
                          <Text style={[styles.gridValue, { color: theme.textPrimary }]} numberOfLines={2}>
                            {booking.timestamp}
                          </Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>STATUS</Text>
                          <Text style={[styles.gridValue, { color: theme.success, fontWeight: '700' }]}>
                            CONFIRMED ✅
                          </Text>
                        </View>
                      </View>

                      {/* Mock Barcode / QR Code */}
                      <View style={styles.barcodeWrapper}>
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 2 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 4 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 1 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 3 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 1 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 5 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 2 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 3 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 1 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 4 }]} />
                        <View style={[styles.barcodeLine, { backgroundColor: theme.dark, width: 2 }]} />
                      </View>
                      <Text style={[styles.barcodeText, { color: theme.textSecondary }]}>
                        Show QR code at entry desk
                      </Text>

                      <Pressable
                        onPress={() => setViewingTicketId(null)}
                        style={[styles.dismissPassBtn, { backgroundColor: theme.primary }]}
                      >
                        <Text style={styles.dismissPassText}>Done</Text>
                      </Pressable>
                    </>
                  );
                })()}
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
  introSection: {
    padding: 20,
    borderBottomLeftRadius: RADIUS.radiusLarge,
    borderBottomRightRadius: RADIUS.radiusLarge,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  introDesc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  eventsWrapper: {
    padding: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  eventCard: {
    borderWidth: 1,
    borderRadius: RADIUS.radiusLarge,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  badgeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  priceVal: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  bookBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  bookingActionBlock: {
    alignItems: 'flex-end',
    gap: 6,
  },
  viewTicketBtn: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTicketText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bookBtnSmall: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  bookBtnSmallText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Ticket Pass Modal Styles
  ticketModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 200,
  },
  ticketPassCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  ticketTopRow: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  passHeaderTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  closePassBtn: {
    padding: 4,
  },
  passBody: {
    padding: 20,
    alignItems: 'center',
  },
  passEventTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  ticketDetailsGrid: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  gridItem: {
    width: '50%',
    padding: 10,
    borderWidth: 0.25,
    borderColor: '#E8E8E8',
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  barcodeWrapper: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
    marginBottom: 6,
  },
  barcodeLine: {
    height: '100%',
  },
  barcodeText: {
    fontSize: 10,
    marginBottom: 20,
  },
  dismissPassBtn: {
    width: '100%',
    height: 42,
    borderRadius: RADIUS.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissPassText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
