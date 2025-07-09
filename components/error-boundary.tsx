'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { RiErrorWarningLine, RiRefreshLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const context = this.props.context || 'Application';
    console.error(`${context} error:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const context = this.props.context || 'page';

      return (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <RiErrorWarningLine className='mb-4 size-12 text-red-500' />
          <h3 className='text-gray-900 text-lg mb-2 font-medium'>
            Something went wrong
          </h3>
          <p className='text-gray-500 text-sm mb-6'>
            {this.state.error?.message ||
              `An unexpected error occurred while loading the ${context}.`}
          </p>
          <Button.Root
            variant='primary'
            size='small'
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
          >
            <RiRefreshLine className='size-4' />
            Try Again
          </Button.Root>
        </div>
      );
    }

    return this.props.children;
  }
}
