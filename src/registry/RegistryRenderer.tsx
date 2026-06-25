import React, { memo } from 'react';
import { COMPONENT_REGISTRY } from './ComponentRegistry';
import { NodeErrorBoundary } from '../components/ErrorBoundary/NodeErrorBoundary';
import type { SDUINode } from '../types/payload.types';

interface Props {
  node: SDUINode;
}

const RegistryRendererInner: React.FC<Props> = ({ node }) => {
  const Component = COMPONENT_REGISTRY[node.type];

  if (!Component) {
    // Unknown type — log in dev, silent drop in production (graceful degradation)
    if (__DEV__) {
      console.warn(
        `[SDUI] Unrecognized component type: "${node.type}" (id: ${node.id}). Dropping node.`
      );
    }
    return null;
  }

  return (
    <NodeErrorBoundary nodeId={node.id}>
      <Component node={node} />
    </NodeErrorBoundary>
  );
};

// Memoize so that unchanged nodes never re-render
export const RegistryRenderer = memo(RegistryRendererInner);
