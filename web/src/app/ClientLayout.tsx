'use client';

import type { ReactNode } from 'react';
import NavClient from '@/components/NavClient';

type Props = {
  loggedIn: boolean;
  children: ReactNode;
};

export default function ClientLayout({ loggedIn, children }: Props) {
  return (
    <>
      <NavClient loggedIn={loggedIn} />
      <main>{children}</main>
    </>
  );
}
