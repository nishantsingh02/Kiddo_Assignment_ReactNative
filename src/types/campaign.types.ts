export type CampaignId =
  | 'BACK_TO_SCHOOL'
  | 'SUMMER_PLAYHOUSE'
  | 'MYSTERY_CARNIVAL';

export interface CampaignConfig {
  id: CampaignId;
  name: string;
  theme_override: {
    primary: string;
    secondary: string;
    background: string;
    backgroundWarm?: string;
    textPrimary?: string;
    borderRadius?: number;
  };
  overlay: OverlayConfig | null;
  feature_sections?: string[]; // IDs of sections to highlight
}

export interface OverlayConfig {
  type: 'FULL_SCREEN_OVERLAY';
  animation_url?: string;      // Remote Lottie JSON URL
  animation_type: 'lottie' | 'webp' | 'reanimated';
  loop: boolean;
  autoplay: boolean;
}
