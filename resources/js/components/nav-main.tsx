import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

type Props = {
  items: NavItem[];
};

export function NavMain({ items }: Props) {
  const page = usePage();

  return (
    <SidebarMenu>
      {items.map((item, index) =>
        item.children ? (
          <SubMenu key={index} item={item} currentUrl={page.url} />
        ) : (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              isActive={page.url===item.href}
              tooltip={{ children: item.title }}
            >
              <Link href={item.href}>
                {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      )}
    </SidebarMenu>
  );
}

function SubMenu({ item, currentUrl }: { item: NavItem; currentUrl: string }) {
  const [open, setOpen] = useState(() =>
    item.children?.some(child => currentUrl.startsWith(child.href)) ?? false
  );

  const isAnyChildActive = item.children?.some(child => currentUrl.startsWith(child.href)) ?? false;

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isAnyChildActive}
          tooltip={{ children: item.title }}
        >
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center w-full"
          >
            {item.icon && <item.icon className="w-5 h-5 mr-2" />}
            <span className="flex-1 text-left">{item.title}</span>
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {open && item.children?.map((child, idx) => (
        <SidebarMenuItem key={idx} className="ml-6">
          <SidebarMenuButton
            asChild
            isActive={currentUrl.startsWith(child.href)}
            tooltip={{ children: child.title }}
          >
            <Link href={child.href}>
              <span>{child.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
