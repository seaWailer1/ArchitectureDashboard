import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecentTransactions } from '@/components/transactions/recent-transactions';

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

describe('Wallet Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RecentTransactions', () => {
    const mockTransactions = [
      {
        id: 1,
        amount: '100.00',
        type: 'send',
        status: 'completed',
        description: 'Test transaction',
        createdAt: new Date().toISOString(),
        fromWalletId: 1,
        toWalletId: 2
      }
    ];

    it('renders transaction list correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions
      });

      render(
        <TestWrapper>
          <RecentTransactions />
        </TestWrapper>
      );

      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Test transaction')).toBeInTheDocument();
      });
    });

    it('handles empty transaction list', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      render(
        <TestWrapper>
          <RecentTransactions />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('No recent transactions')).toBeInTheDocument();
      });
    });

    it('handles API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      render(
        <TestWrapper>
          <RecentTransactions />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading transactions')).toBeInTheDocument();
      });
    });
  });
});