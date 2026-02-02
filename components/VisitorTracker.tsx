'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisitor } from '@/lib/visitorTracking';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track visitor on initial load and route changes
    trackVisitor(pathname);
  }, [pathname]);

  return null; // This component doesn't render anything
}

