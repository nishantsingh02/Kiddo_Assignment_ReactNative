import { router } from 'expo-router';
import type { ActionObject, ActionType } from '../types/action.types';
import { cartStore } from '../context/CartContext';

// Handler map: each ActionType → its handler function
type ActionHandler = (payload: any) => void;

const ACTION_HANDLERS: Record<ActionType, ActionHandler> = {
  DEEP_LINK: (payload) => {
    const { url } = payload as { url: string };
    console.log('[ActionDispatcher] Navigating to deep link:', url);
    try {
      // In Expo Router, paths are absolute starting with / or relative
      router.push(url as any);
    } catch (e) {
      console.error('[ActionDispatcher] Navigation failed:', e);
    }
  },

  ADD_TO_CART: (payload) => {
    const p = payload as { id: string; name: string; price: number; quantity?: number; image_url?: string; local_image?: string };
    cartStore.getState().addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: p.quantity ?? 1,
      image_url: p.image_url,
      local_image: p.local_image,
    });
  },

  REMOVE_FROM_CART: (payload) => {
    const { id } = payload as { id: string };
    cartStore.getState().removeItem(id);
  },

  OPEN_MODAL: (payload) => {
    const { modal_id } = payload as { modal_id: string };
    console.log('[ActionDispatcher] Open modal:', modal_id);
    // Modal popup simulation or alert
    alert(`Promo Action: Open Modal "${modal_id}"`);
  },

  APPLY_COUPON: (payload) => {
    const { code } = payload as { code: string };
    cartStore.getState().applyCoupon(code);
  },

  APPLY_MYSTERY_GIFT_COUPON: (payload) => {
    const { code } = payload as { code: string };
    cartStore.getState().applyMysteryGift(code);
  },

  BOOK_EVENT: (payload) => {
    const { event_id, event_name } = payload as { event_id: string; event_name?: string };
    console.log('[ActionDispatcher] Booking event:', event_id);
    alert(`🎉 Successfully Booked: "${event_name || event_id}"! Check your inbox.`);
  },

  OPEN_EXTERNAL_URL: (payload) => {
    const { url } = payload as { url: string };
    console.log('[ActionDispatcher] Opening external URL:', url);
    import('react-native').then(({ Linking }) => {
      Linking.openURL(url).catch((err) => {
        console.error('[ActionDispatcher] Failed to open external URL:', err);
        // Fallback for web
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      });
    });
  },

  TRACK_EVENT: (payload) => {
    console.log('[Analytics Event Tracked]:', payload);
  },
};

/**
 * Central action dispatcher. Components call this with a raw ActionObject.
 * The dispatcher routes to the correct handler.
 * Unknown action types are caught and logged without crashing.
 */
export function handleAction(action: ActionObject): void {
  if (!action || !action.type) {
    console.warn('[ActionDispatcher] Empty action object passed');
    return;
  }
  const handler = ACTION_HANDLERS[action.type];

  if (!handler) {
    if (__DEV__) {
      console.warn(
        `[ActionDispatcher] Unknown action type: "${action.type}"`,
        action.payload
      );
    }
    return;
  }

  try {
    handler(action.payload);
  } catch (error) {
    console.error(`[ActionDispatcher] Handler failed for "${action.type}":`, error);
    // Do NOT re-throw — a single failed action must never crash the app
  }
}
