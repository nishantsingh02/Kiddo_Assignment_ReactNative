import React from 'react';
import { BannerHero } from '../components/BannerHero/BannerHero';
import { ProductGrid2x2 } from '../components/ProductGrid2x2/ProductGrid2x2';
import { DynamicCollection } from '../components/DynamicCollection/DynamicCollection';
import type { SDUINode } from '../types/payload.types';

// The registry type: maps a string key to a React component
type RegistryComponent = React.ComponentType<{ node: any }>;

type ComponentRegistry = Readonly<Record<string, RegistryComponent>>;

export const COMPONENT_REGISTRY: ComponentRegistry = {
  BANNER_HERO: BannerHero as RegistryComponent,
  PRODUCT_GRID_2X2: ProductGrid2x2 as RegistryComponent,
  DYNAMIC_COLLECTION: DynamicCollection as RegistryComponent,
} as const;
