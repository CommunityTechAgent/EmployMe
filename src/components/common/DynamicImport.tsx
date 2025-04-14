import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface DynamicImportProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  loading?: React.ReactNode;
  ssr?: boolean;
}

export function DynamicImport({ 
  component, 
  loading = <div>Loading...</div>,
  ssr = false 
}: DynamicImportProps) {
  const DynamicComponent = dynamic(component, {
    loading: () => loading,
    ssr,
  });

  return <DynamicComponent />;
} 