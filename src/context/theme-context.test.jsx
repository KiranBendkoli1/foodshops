import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React, { useContext } from 'react';
import ThemeContextProvider, { ThemeContext } from './theme-context';

// Utility component to test context
const TestComponent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-btn">Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('provides the default theme as "light"', () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('toggles theme when toggleTheme is called', () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );
    
    const toggleBtn = screen.getByTestId('toggle-btn');
    fireEvent.click(toggleBtn);
    
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('persists theme in localStorage', () => {
    localStorage.setItem('theme', 'dark');
    
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );
    
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
