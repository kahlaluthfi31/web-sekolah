'use client';

import dynamic from 'next/dynamic';

// App is a client-only SPA — disable SSR to prevent sessionStorage errors
const App = dynamic(() => import('@/App'), { ssr: false });

export default function Home() {
  return <App />;
}
