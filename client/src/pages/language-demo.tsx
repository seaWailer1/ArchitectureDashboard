import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';

export default function LanguageDemo() {
  const { tm, language, isRTL, formatCurrency, formatNumber, formatDate, culturalSettings } = useLanguage();

  const demoData = {
    balance: 12500.75,
    transactions: 4,
    date: new Date(),
    phone: '+254712345678',
    email: 'user@afripay.com'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-6 pb-20 max-w-4xl">
        <div className="space-y-6">
          {/* Header with Language Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {tm.appName} - {tm.languageSettings}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {tm.appTagline}
              </p>
            </div>
            <LanguageSelector variant="default" className="shrink-0" />
          </div>

          {/* Language Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌍 {tm.languageSettings}
                <Badge variant="outline">{language.toUpperCase()}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <strong>{tm.language}:</strong> {tm.languages[language]}
                </div>
                <div>
                  <strong>Direction:</strong> {isRTL ? 'Right-to-Left (RTL)' : 'Left-to-Right (LTR)'}
                </div>
                <div>
                  <strong>Currency:</strong> {culturalSettings.currency}
                </div>
                <div>
                  <strong>Locale:</strong> {culturalSettings.locale}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Content with Translations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Information */}
            <Card>
              <CardHeader>
                <CardTitle>{tm.totalBalance}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(demoData.balance)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{tm.availableBalance}:</span>
                    <span className="font-medium">{formatCurrency(demoData.balance * 0.8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{tm.pendingBalance}:</span>
                    <span className="font-medium">{formatCurrency(demoData.balance * 0.2)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tm.recentTransactions}: {formatNumber(demoData.transactions)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>{tm.personalInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{tm.email}:</span>
                    <p className="font-medium">{demoData.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{tm.phone}:</span>
                    <p className="font-medium">{demoData.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{tm.today}:</span>
                    <p className="font-medium">{formatDate(demoData.date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{tm.quickServices}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex-col gap-2">
                  💸
                  <span className="text-xs">{tm.send}</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2">
                  💰
                  <span className="text-xs">{tm.receive}</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2">
                  📱
                  <span className="text-xs">{tm.buyAirtime}</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2">
                  🧾
                  <span className="text-xs">{tm.payBills}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Roles */}
          <Card>
            <CardHeader>
              <CardTitle>{tm.selectRole}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="text-2xl mb-2">👤</div>
                  <h3 className="font-medium">{tm.consumer}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Personal banking and payments
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="text-2xl mb-2">🏪</div>
                  <h3 className="font-medium">{tm.merchant}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Business payments and sales
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="text-2xl mb-2">🤝</div>
                  <h3 className="font-medium">{tm.agent}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Cash-in and cash-out services
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Status Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span>{tm.payment} #12345</span>
                  <Badge className="bg-green-100 text-green-800">{tm.statusCompleted}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span>{tm.transfer} #12346</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{tm.statusPending}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span>{tm.topUp} #12347</span>
                  <Badge className="bg-blue-100 text-blue-800">{tm.statusProcessing}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Selector Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Language Selector Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm">Default:</span>
                  <LanguageSelector variant="default" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm">Compact:</span>
                  <LanguageSelector variant="compact" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm">Minimal:</span>
                  <LanguageSelector variant="minimal" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}