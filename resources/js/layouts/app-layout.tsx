import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import ThemeProvider from "@/components/ThemeProvider";
interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
<ThemeProvider>
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
</ThemeProvider>    
);
