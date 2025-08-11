import React from 'react';

type ErrorBoundaryState = { hasError: boolean };

/**
 * 错误边界：捕获子树渲染错误并渲染兜底 UI
 */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 可接入日志系统
    // eslint-disable-next-line no-console
    console.error('Render Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>页面出错了，请稍后重试。</div>;
    }
    return this.props.children;
  }
}


