'use client';

import { Suspense } from 'react';
import NewArrivalsContent from './NewArrivalsContent';

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">New Arrivals</h1>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    }>
      <NewArrivalsContent />
    </Suspense>
  );
}
