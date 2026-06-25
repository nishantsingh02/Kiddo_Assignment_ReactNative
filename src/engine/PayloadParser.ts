import type { HomepagePayload, SDUINode } from '../types/payload.types';

/**
 * Validates the raw server response and returns a safe, normalized payload.
 * This function NEVER throws — it returns a partial/empty payload
 * rather than crashing the app.
 */
export function parseHomepagePayload(raw: unknown): HomepagePayload | null {
  if (!raw || typeof raw !== 'object') {
    console.error('[PayloadParser] Invalid payload: not an object');
    return null;
  }

  const data = raw as Record<string, unknown>;

  // Validate sections array
  if (!Array.isArray(data.sections)) {
    console.error('[PayloadParser] Invalid payload: sections is not an array');
    return null;
  }

  // Filter out nodes that are missing the required "id" or "type" fields
  const validSections = data.sections.filter((node): node is SDUINode => {
    if (!node || typeof node !== 'object') return false;
    const n = node as Record<string, unknown>;
    if (typeof n['id'] !== 'string' || !n['id']) {
      console.warn('[PayloadParser] Dropping node: missing "id"', n);
      return false;
    }
    if (typeof n['type'] !== 'string' || !n['type']) {
      console.warn('[PayloadParser] Dropping node: missing "type"', n);
      return false;
    }
    return true;
  });

  // Safe theme extraction
  const rawTheme = data.theme as Record<string, unknown> | undefined;
  const safeTheme: HomepagePayload['theme'] = {
    primary: typeof rawTheme?.primary === 'string' ? rawTheme.primary : '#008080',
    primaryLight: typeof rawTheme?.primaryLight === 'string' ? rawTheme.primaryLight : '#E0F2F2',
    accent: typeof rawTheme?.accent === 'string' ? rawTheme.accent : '#E4B8AD',
    dark: typeof rawTheme?.dark === 'string' ? rawTheme.dark : '#202020',
    surface: typeof rawTheme?.surface === 'string' ? rawTheme.surface : '#FFFFFF',
    background: typeof rawTheme?.background === 'string' ? rawTheme.background : '#F5F5F5',
    backgroundWarm: typeof rawTheme?.backgroundWarm === 'string' ? rawTheme.backgroundWarm : '#FFF5F0',
    border: typeof rawTheme?.border === 'string' ? rawTheme.border : '#E8E8E8',
    textPrimary: typeof rawTheme?.textPrimary === 'string' ? rawTheme.textPrimary : '#202020',
    textSecondary: typeof rawTheme?.textSecondary === 'string' ? rawTheme.textSecondary : '#757575',
    textDisabled: typeof rawTheme?.textDisabled === 'string' ? rawTheme.textDisabled : '#BDBDBD',
    error: typeof rawTheme?.error === 'string' ? rawTheme.error : '#D32F2F',
    success: typeof rawTheme?.success === 'string' ? rawTheme.success : '#2E7D32',
    warning: typeof rawTheme?.warning === 'string' ? rawTheme.warning : '#F57C00',
    starRating: typeof rawTheme?.starRating === 'string' ? rawTheme.starRating : '#FFB300',
    borderRadius: typeof rawTheme?.borderRadius === 'number' ? rawTheme.borderRadius : 12,
    fontScale: typeof rawTheme?.fontScale === 'number' ? rawTheme.fontScale : 1.0,
    fontFamily: typeof rawTheme?.fontFamily === 'string' ? rawTheme.fontFamily : 'System',
  };

  return {
    version: typeof data.version === 'string' ? data.version : '1.0.0',
    theme: safeTheme,
    campaign: (data.campaign && typeof data.campaign === 'object') ? (data.campaign as HomepagePayload['campaign']) : null,
    sections: validSections,
  };
}
