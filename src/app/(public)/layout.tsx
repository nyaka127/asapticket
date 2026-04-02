import React from 'react';
import { GlobalPublicFooter } from '@/components/GlobalPublicFooter';
import { GlobalPublicHeader } from '@/components/GlobalPublicHeader';
import { ScrollToTop } from '@/components/ScrollToTop';
import { TranslationProvider } from '@/components/TranslationProvider';
import { TrustedPartners } from '@/components/TrustedPartners';
import VisitorTracker from '@/components/VisitorTracker';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <VisitorTracker />
      <ScrollToTop />
      <GlobalPublicHeader />
      {children}
      <TrustedPartners />
      <GlobalPublicFooter />
    </TranslationProvider>
  );
}