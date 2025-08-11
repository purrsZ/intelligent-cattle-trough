import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
}));

test('renders app container', () => {
  render(<App />);
  expect(screen.getByText(/饲槽监控/i)).toBeInTheDocument();
});
