'use client';

import { MarketplaceProvider } from '@/lib/marketplace-context';
import { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return <MarketplaceProvider>{children}</MarketplaceProvider>;
}
