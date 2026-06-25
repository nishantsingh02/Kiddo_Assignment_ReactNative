export type ActionType =
  | 'DEEP_LINK'
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'OPEN_MODAL'
  | 'APPLY_COUPON'
  | 'APPLY_MYSTERY_GIFT_COUPON'
  | 'BOOK_EVENT'
  | 'OPEN_EXTERNAL_URL'
  | 'TRACK_EVENT';

export interface ActionObject {
  type: ActionType;
  payload: ActionPayload;
}

export type ActionPayload =
  | DeepLinkPayload
  | AddToCartPayload
  | RemoveFromCartPayload
  | CouponPayload
  | BookEventPayload
  | ExternalUrlPayload
  | OpenModalPayload
  | GenericPayload;

export interface DeepLinkPayload {
  url: string;
}

export interface AddToCartPayload {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  image_url?: string;
  local_image?: string;
}

export interface RemoveFromCartPayload {
  id: string;
}

export interface CouponPayload {
  code: string;
  discount_type?: 'flat' | 'percent';
  value?: number;
}

export interface BookEventPayload {
  event_id: string;
  event_name: string;
  slots_available: number;
}

export interface ExternalUrlPayload {
  url: string;
}

export interface OpenModalPayload {
  modal_id: string;
}

export interface GenericPayload {
  [key: string]: unknown;
}
