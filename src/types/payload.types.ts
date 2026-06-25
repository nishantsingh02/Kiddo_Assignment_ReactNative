import type { ActionObject } from './action.types';
import type { CampaignConfig } from './campaign.types';

export interface HomepagePayload {
  version: string;                    // Schema version for compatibility checks
  theme: ThemeConfig;                 // OTA theme injection
  campaign?: CampaignConfig | null;   // Active campaign (null if none)
  sections: SDUINode[];               // Ordered list of UI blocks
}

export interface ThemeConfig {
  primary: string;          // e.g. "#008080"
  primaryLight: string;     // e.g. "#E0F2F2"
  accent: string;           // e.g. "#E4B8AD" (blush pink)
  dark: string;             // e.g. "#202020"
  surface: string;          // e.g. "#FFFFFF"
  background: string;       // e.g. "#F5F5F5"
  backgroundWarm: string;   // e.g. "#FFF5F0"
  border: string;           // e.g. "#E8E8E8"
  textPrimary: string;      // e.g. "#202020"
  textSecondary: string;    // e.g. "#757575"
  textDisabled: string;     // e.g. "#BDBDBD"
  error: string;            // e.g. "#D32F2F"
  success: string;          // e.g. "#2E7D32"
  warning: string;          // e.g. "#F57C00"
  starRating: string;       // e.g. "#FFB300"
  borderRadius: number;     // e.g. 12
  fontScale: number;        // e.g. 1.0
  fontFamily?: string;       // e.g. "Lato"
}

export type SDUINode =
  | BannerHeroNode
  | ProductGrid2x2Node
  | DynamicCollectionNode
  | UnknownNode;

export interface BaseNode {
  id: string;               // Stable key for FlatList keyExtractor
  type: string;             // Registry lookup key
  analytics?: AnalyticsTag; // Optional event tracking metadata
}

export interface AnalyticsTag {
  section_name: string;
  position: number;
}

export interface BannerItem {
  id: string;
  image_url: string;
  local_image?: string;
  title?: string;
  subtitle?: string;
  cta_label?: string;
  action: ActionObject;
}

export interface BannerHeroNode extends BaseNode {
  type: 'BANNER_HERO';
  image_url?: string;
  local_image?: string;      // Key to reference local photos folder
  title?: string;
  subtitle?: string;
  cta_label?: string;
  action?: ActionObject;
  banners?: BannerItem[];
}

export interface ProductGrid2x2Node extends BaseNode {
  type: 'PRODUCT_GRID_2X2';
  heading?: string;
  products: ProductItem[];
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  local_image?: string;
  badge?: string;            // e.g. "NEW", "SALE", "HOT"
  rating?: number;           // e.g. 4.8
  action: ActionObject;
  add_to_cart_action: ActionObject;
}

export interface DynamicCollectionNode extends BaseNode {
  type: 'DYNAMIC_COLLECTION';
  theme_label: string;       // e.g. "Summer Essentials"
  scroll_direction: 'horizontal';
  items: CollectionItem[];
}

export interface CollectionItem {
  id: string;
  title: string;
  image_url: string;
  local_image?: string;
  price?: number;
  rating?: number;
  action: ActionObject;
  add_to_cart_action?: ActionObject;
}

export interface UnknownNode extends BaseNode {
  type: string;
  [key: string]: unknown;
}
