import React from 'react';
import { GlobalPublicFooter } from '@/components/GlobalPublicFooter';
import { GlobalPublicHeader } from '@/components/GlobalPublicHeader';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalPublicHeader />
      {children}
      <GlobalPublicFooter />
    </>
  );
}