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
import { TreeNode } from 'primereact/treenode';

interface Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
}

interface Permission {
    id: number; 
    name: string;
    module: string;
    description: string; 
    is_active: number;
}

type Props = {
  role: Role;
  permissions: Record<string, Permission[]>;
  flash?: {
    success?: string;
    error?: string;
  };
};

const RoleMenuPage: React.FC<Props> = ({ role, permissions }) => {
  const toast = useRef<Toast>(null);
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
  const { __ } = useLang(); 
  const [currPermissions, setCurrPermissions] = useState(permissions); 

function buildSelectionKeys(
  selectedPermissions: Permission[],
  allPermissionsByModule: Record<string, Permission[]>
): TreeTableSelectionKeysType {
  const keys: TreeTableSelectionKeysType = {};
  const selectedIds = new Set(selectedPermissions.map((p) => p.id));

  for (const [module, allPerms] of Object.entries(allPermissionsByModule)) {
    let selectedCount = 0;

    allPerms.forEach((perm) => {
      const key = perm.id;
      if (selectedIds.has(perm.id)) {
        keys[key] = { checked: true };
        selectedCount++;
      }
    });

    if (selectedCount === allPerms.length) {
      keys[module] = { checked: true }; // fully checked
    } else if (selectedCount > 0) {
      keys[module] = { partialChecked: true }; // half checked
    }
    // else do not set anything (unchecked)
  }

  return keys;
}
 
  console.log(role.permissions);
  const [selectionKeys, setSelectionKeys] = useState<TreeTableSelectionKeysType>(
    buildSelectionKeys(role.permissions ?? [], permissions)
  );

  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [{ title: __('permission.permissions'), href: route('roles.index') }];

  useEffect(() => {
    if (flash?.success) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    }
    if (flash?.error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }
  }, [flash]);

    const { data, setData, put, processing } = useForm({
    permission_ids: [] as number[],
    });

  function convertMenusToTreeNodes(input: Record<string, Permission[]>): TreeNode[] {
    return Object.entries(input).map(([module, items]) => ({
      key: module,
      label: module.charAt(0).toUpperCase() + module.slice(1).replace(/_/g, ' '),
      is_active: 1,
      children: items.map((item) => ({
        key: item.id,  // unique key
        label: item.name,
        id: String(item.id),
        is_active: item.is_active,
        data: {
            name: item.name,
            description: item.description,   
            is_active: item.is_active,
          },
      })),
    }));
  }

  function groupByModule(permissions: unknown): Record<string, Permission[]> {
    if (!Array.isArray(permissions)) {
      console.warn('Expected permissions to be an array, got:', permissions);
      return {};
    }

    return permissions.reduce((acc, perm: Permission) => {
      if (!acc[perm.module]) acc[perm.module] = [];
      acc[perm.module].push(perm);
      return acc;
    }, {} as Record<string, Permission[]>);
  } 

  const flattenPermissions = (permissionsObject: Record<string, Permission[]>): Permission[] => {
  return Object.values(permissionsObject).flat();
};

const flatPermissions = flattenPermissions(currPermissions);
// Then use it like this:
const grouped = groupByModule(flatPermissions);

const treeNodes = convertMenusToTreeNodes(grouped);
console.log(treeNodes);
const handleSubmit = () => { 
  put(route('roles.permissions-update', role.id)); 
} 

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('permission.permissions')} />
      <Toast ref={toast} />

      <div className="p-4">
        <TreeTable
          value={treeNodes}
          selectionMode="checkbox"
          selectionKeys={selectionKeys}
          onSelectionChange={(e) => {
            const keys = Object.keys(e.value || {});
            const selectedIds = keys.map((id) => parseInt(id)).filter((id) => !isNaN(id));
            setSelectionKeys(e.value as TreeTableSelectionKeysType);
            setData('permission_ids', selectedIds);  
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
                return (rowData.label);
              }}
          />
          <Column field="description" header={__('menu.description')} /> 
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
