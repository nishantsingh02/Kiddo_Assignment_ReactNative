import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HomepagePayload } from '../types/payload.types';
import type { CampaignId } from '../types/campaign.types';
import { parseHomepagePayload } from '../engine/PayloadParser';

// Dynamic import of payloads (we'll define these mock files next)
import defaultFeedPayload from '../campaigns/payloads/defaultFeed.json';
import backToSchoolPayload from '../campaigns/payloads/backToSchool.json';
import summerPlayhousePayload from '../campaigns/payloads/summerPlayhouse.json';
import mysteryCarnivalPayload from '../campaigns/payloads/mysteryCarnival.json';

interface CampaignContextType {
  activeCampaignId: CampaignId | null;
  activePayload: HomepagePayload;
  setCampaign: (campaignId: CampaignId | null) => void;
}

const CampaignContext = createContext<CampaignContextType | null>(null);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCampaignId, setActiveCampaignId] = useState<CampaignId | null>(null);
  const [activePayload, setActivePayload] = useState<HomepagePayload>(
    parseHomepagePayload(defaultFeedPayload) as HomepagePayload
  );

  const setCampaign = (campaignId: CampaignId | null) => {
    setActiveCampaignId(campaignId);
    let rawPayload;
    switch (campaignId) {
      case 'BACK_TO_SCHOOL':
        rawPayload = backToSchoolPayload;
        break;
      case 'SUMMER_PLAYHOUSE':
        rawPayload = summerPlayhousePayload;
        break;
      case 'MYSTERY_CARNIVAL':
        rawPayload = mysteryCarnivalPayload;
        break;
      default:
        rawPayload = defaultFeedPayload;
    }

    const parsed = parseHomepagePayload(rawPayload);
    if (parsed) {
      setActivePayload(parsed);
    }
  };

  return (
    <CampaignContext.Provider value={{ activeCampaignId, activePayload, setCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
