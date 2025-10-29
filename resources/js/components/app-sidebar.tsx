import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react'; 
import { GetLucideIcon } from '@/lib/IconHelper';
import { usePage } from '@inertiajs/react';
import AppLogo from './app-logo';
import * as Icons from 'lucide-react';
 
type PageProps = {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
    roles: string[];
    permissions: string[];
    menus: Menu[]; // <- move menus here
  };
};
 
type Menu = {
  id: number;
  name: string;
  url: string;
  icon_id?: string;
  parent_id: number | null;
  children: Menu[];
};
  
function buildNavItems(menus: Menu[], parentId: number | null = null): NavItem[] {
   return menus
    .filter(menu => menu.parent_id === parentId)
    .map(menu => {
    const children = buildNavItems(menus, menu.id);

    const navItem: NavItem = {
        title: menu.name,
        href: menu.url,
        icon: menu.icon_id ? GetLucideIcon(menu.icon_id) : undefined,
        ...(children.length > 0 ? { children } : {}),
    };

    return navItem;
    });
}


 
const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/mfachrizaltech/laravel12-react-starterkit-base-main',
        icon: Icons.Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: Icons.BookOpen,
    },
    {
        title: 'Donate via Saweria',
        href: 'https://saweria.co/mfachrizaltech',
        icon: Icons.Heart,
    },
    {
        title: 'Donate via Ko-fi',
        href: '];ko-fi.com/mfachrizaltech',
        icon: Icons.Heart,
    },
]
 
export const AppSidebar = () => {  
const { auth } = usePage<PageProps>().props;
const menus = auth.menus ?? []; 
const mainNavItems =  buildNavItems(menus);
 

  return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
  );
};
 