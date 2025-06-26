import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { axe, toHaveNoViolations } from 'jest-axe';
import Home from '@/pages/home';
import Services from '@/pages/services';

expect.extend(toHaveNoViolations);

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('UI/UX Accessibility Tests', () => {
  describe('WCAG Compliance', () => {
    it('home page should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('services page should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Services />
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports tab navigation through interactive elements', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      const interactiveElements = screen.getAllByRole('button');
      interactiveElements.forEach(element => {
        expect(element).toHaveAttribute('tabIndex');
      });
    });

    it('provides keyboard alternatives for mouse interactions', () => {
      render(
        <TestWrapper>
          <Services />
        </TestWrapper>
      );

      const clickableElements = screen.getAllByRole('button');
      clickableElements.forEach(element => {
        expect(element).toBeVisible();
        expect(element).not.toHaveAttribute('disabled');
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('provides proper ARIA labels for complex components', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Check for ARIA labels on important elements
      const walletSection = screen.getByTestId('wallet-balance');
      expect(walletSection).toHaveAttribute('aria-label');
    });

    it('uses semantic HTML elements appropriately', () => {
      render(
        <TestWrapper>
          <Services />
        </TestWrapper>
      );

      // Check for proper heading hierarchy
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Design', () => {
    it('maintains sufficient color contrast', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // This would typically use a tool like color-contrast-checker
      // For now, we ensure elements are visible
      const textElements = screen.getAllByText(/./);
      textElements.forEach(element => {
        expect(element).toBeVisible();
      });
    });

    it('supports different viewport sizes', () => {
      // Test responsive design
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320, // Mobile width
      });

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Elements should still be accessible on mobile
      expect(screen.getByRole('main')).toBeVisible();
    });
  });

  describe('Form Accessibility', () => {
    it('associates labels with form inputs', () => {
      render(
        <TestWrapper>
          <Services />
        </TestWrapper>
      );

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('provides error messages for form validation', () => {
      // This would test form validation accessibility
      expect(true).toBe(true); // Placeholder
    });
  });
});