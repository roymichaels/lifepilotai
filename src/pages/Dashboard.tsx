import React from 'react';
import { AuraLayout } from '@/components/dashboard/AuraLayout';

export function Dashboard() {
  if (import.meta.env.DEV) console.log("Dashboard component is rendering");
  return <AuraLayout />;
}
