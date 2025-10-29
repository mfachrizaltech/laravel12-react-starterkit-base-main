import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useLang } from '@/lib/lang';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Main', href: '/main' },
];
 

export default function Home() {
  const { __ } = useLang();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('Main')} />
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          {__('main.welcome')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
          {__('main.message1')}
        </p>
      </div>
    </AppLayout>
  );
}
