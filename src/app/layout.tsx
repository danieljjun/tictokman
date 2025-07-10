'use client';

import { useEffect } from 'react';
import { settingsManager } from '@/utils/settings';
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'TikTokMan - Professional Fitness Training',
  description: 'Experience personalized fitness training with TikTokMan',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TikTokMan'
  },
  formatDetection: {
    telephone: true
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 앱 시작시 서버에서 설정 로드
    settingsManager.loadFromServer();
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
