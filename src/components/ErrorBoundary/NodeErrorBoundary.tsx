import React from 'react';

interface Props {
  nodeId: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Wraps each SDUI node in an error boundary.
 * If a single component throws during render, this catches it,
 * logs the error, and renders nothing — preserving the rest of the feed.
 */
export class NodeErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error(
      `[NodeErrorBoundary] Node "${this.props.nodeId}" threw:`,
      error,
      info.componentStack
    );
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Silent drop in production — renders nothing, preserving surrounding feed
      return null;
    }
    return this.props.children;
  }
}
