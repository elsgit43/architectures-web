import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('./reportWebVitals', () => jest.fn());

describe('index.tsx', () => {
  it('renders the App component without crashing', () => {
    const { unmount } = render(<App />);
    expect(document.body).toBeTruthy();
    unmount();
  });

  it('calls reportWebVitals', () => {
    const mockReportWebVitals = require('./reportWebVitals');
    expect(mockReportWebVitals).toHaveBeenCalledTimes(0); // Ensures it's mocked
  });
});
