import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, theme as AntdTheme } from 'antd';
import MainLayout from './layouts/MainLayout';
import { LoginPage } from './pages/login';
import { MonitorPage } from './pages/monitor';
import { OverviewPage } from './pages/overview';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          algorithm: AntdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 6,
          },
        }}
      >
        <AntdApp>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/overview"
                element={
                  <MainLayout>
                    <OverviewPage />
                  </MainLayout>
                }
              />
              <Route
                path="/monitor"
                element={
                  <MainLayout>
                    <MonitorPage />
                  </MainLayout>
                }
              />
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
