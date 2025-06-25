import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '../components/client-providers';

export const metadata: Metadata = {
  title: 'AfriPay - Pan-African Fintech SuperApp',
  description: 'Complete fintech solution for Africa with multi-role wallets, QR payments, and financial services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AntdRegistry>
          <ClientProviders>
            {children}
          </ClientProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}