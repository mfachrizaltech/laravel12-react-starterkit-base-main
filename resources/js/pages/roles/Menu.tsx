import 'primeicons/primeicons.css';
import AppLayout from '@/layouts/app-layout';
import { useLang } from '@/lib/lang';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { TreeTable } from 'primereact/treetable';
import { TreeTableSelectionKeysType } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'; 
import { GetLucideIcon } from '@/lib/IconHelper';
import { TreeNode } from 'primereact/treenode';

interface Role {
    id: number;
    name: string;
    description: string;
    menus: Menu[];
}

type Menu = {
  id: number;
  parent_id: number | null;
  name: string;
  description: string | null;
  icon_id: string | null;
  url: string | null;
  order_number: number;
  is_active: number;
  children: Menu[];
};

type Props = {
  role: Role;
  menus: Menu[];
  flash?: {
    success?: string;
    error?: string;
  };
};

const RoleMenuPage: React.FC<Props> = ({ role, menus }) => {
  const toast = useRef<Toast>(null);
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
  const { __ } = useLang();

  const [currMenus, setCurrMenus] = useState(menus); 

  const buildSelectionKeys = (menus: Menu[]): TreeTableSelectionKeysType => {
    const keys: TreeTableSelectionKeysType = {};
    menus.forEach((menu) => {
      keys[menu.id.toString()] = { checked: true };
    });
    return keys;
  };

  const [selectionKeys, setSelectionKeys] = useState<TreeTableSelectionKeysType>(
    buildSelectionKeys(role.menus ?? [])
  );

  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [{ title: __('menu.menu'), href: route('menus.index') }];

  useEffect(() => {
    if (flash?.success) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    }
    if (flash?.error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }
  }, [flash]);

    const { data, setData, put, processing } = useForm({
      menu_ids: [] as number[],
    });

  const convertMenusToTreeNodes = (menus: Menu[]): TreeNode[] => {
    return menus.map((menu) => ({
      key: String(menu.id),
      id: String(menu.id),
      icon: menu.icon_id,
      is_active: menu.is_active,
      data: {
        name: menu.name,
        description: menu.description,
        icon_id: menu.icon_id,
        url: menu.url,
        order_number: menu.order_number,
        is_active: menu.is_active,
      },
      children: menu.children ? convertMenusToTreeNodes(menu.children) : [],
      selectable: true,
    }));
  };

   const treeNodes = convertMenusToTreeNodes(currMenus);
   
  const handleSubmit = () => { 
    put(route('roles.menus-update', role.id));
  } 

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('menu.menu')} />
      <Toast ref={toast} />

      <div className="p-4">
        <TreeTable
          value={treeNodes}
          selectionMode="checkbox"
          selectionKeys={selectionKeys}
            onSelectionChange={(e) => {
            const keys = Object.keys(e.value || {});
            const selectedIds = keys.map((id) => parseInt(id));
            setSelectionKeys(e.value as TreeTableSelectionKeysType);
            setData('menu_ids', selectedIds);  
            }}
          resizableColumns
          showGridlines
          columnResizeMode="expand"
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column
            field="name"
            header={__('menu.name')}
            expander
            bodyStyle={{ display: 'flex' }}
            body={(rowData) => {
              const Icon = GetLucideIcon(rowData.data.icon_id);
              return (
                <div className="flex items-center font-medium">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="ml-2">{rowData.data.name}</span>
                </div>
              );
            }}
          />
          <Column field="description" header={__('menu.description')} />
          <Column field="url" header={__('menu.url')} />
          <Column
            field="is_active"
            header={__('product.is_active')} 
            style={{ textAlign: 'center', minWidth: '12rem' }} 
              body={(rowData) => {
                console.log(rowData);
                const status = rowData.is_active===1 ? 'ON' : 'OFF';
                let color = '';
                switch (status) {
                  case 'ON':
                    color = 'bg-green-200 text-green-800';
                    break;
                  case 'OFF':
                    color = 'bg-red-200 text-red-800'; 
                }
                return (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
                  >
                    {status}
                  </span>
                );
              }}
          />           
        </TreeTable>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            label={__('button.back')}
            className="p-button-secondary"
            onClick={() => {
              setIsNavigatingBack(true);
              router.visit(route('roles.index'), {
                onFinish: () => setIsNavigatingBack(false),
              });
            }}
            loading={isNavigatingBack}
          />
        <Button
        type="button"
        label={__('button.save')}
        onClick={handleSubmit}
        loading={processing}
        />
        </div>
      </div>
    </AppLayout>
  );
};

export default RoleMenuPage;
