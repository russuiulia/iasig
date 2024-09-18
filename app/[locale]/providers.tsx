'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { useRouter } from 'next/navigation';
import { UserProvider } from '@/context/UserContext';
import { ForexProvider } from '@/context/ForexContext';
import { LanguageContext, LanguageProvider } from '@/context/LanguageContext';
import { useCurrentLocale } from '@/locales/client';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const locale = useCurrentLocale();
  return (
    <NextUIProvider navigate={router.push}>
      <LanguageProvider
        locale={locale.toString()}
        translate={() => ''}
        pageKey={''}
      >
        <UserProvider>
          <ForexProvider>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
          </ForexProvider>
        </UserProvider>
      </LanguageProvider>
    </NextUIProvider>
  );
}
