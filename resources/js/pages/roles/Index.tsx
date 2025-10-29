import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import { useLang } from '@/lib/lang';
import { type BreadcrumbItem } from '@/types'; 
import { Head, usePage, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast';  
import { FilterMatchMode } from 'primereact/api';
import { SelectButton } from 'primereact/selectbutton'; 
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface Role {
    id: number;
    name: string;
    description: string;
}

type Props = {
  roles: {
    data: Role[];
    current_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  }; 
};

const RoleIndexPage: React.FC<Props> = ({ roles }) => {
  const toast = useRef<Toast>(null); 
  const { filters: initialFilters = {} } = usePage().props as any;

  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

  const { __ } = useLang();
  
  const [loadingButton, setLoadingButton] = useState<{
    id: number | null;
    action: string | null;
  }>({ id: null, action: null });

  const [currRoles, setCurrRoles] = useState(roles.data); 
    useEffect(() => {
      setCurrRoles(roles.data);
    }, [roles]);
      
  const [tableKey, setTableKey] = useState(0); 
  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 2 },
  ];

  const [filters, setFilters] = useState({ 
    name: { value: initialFilters?.filters?.name?.value || null, matchMode: FilterMatchMode.CONTAINS },
    label: { value: initialFilters?.filters?.label?.value || null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: initialFilters?.filters?.description?.value || null, matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS }, 
  });  
 
 
  const onFilterChange = (e: any) => {
    setFilters(e.filters);  
    // Send filters to Laravel
    router.get(route('roles.index'), {
      filters: e.filters,
    }, { 
      preserveState: true,
    });
  };

  useEffect(() => {
    if (flash.success) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    }
    if (flash.error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }
  }, [flash]);
 
  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('role.role'), href: route('roles.index') },
  ];

  const onPage = (e: DataTablePageEvent) => {
    const page = (e.page ?? 0) + 1;
    router.get(route('roles.index'), { page, search: filters }, { preserveScroll: true, preserveState: true });
  };
   
  const confirmDelete = (role: Role, onSuccess?: () => void) => { 
    confirmDialog({
      message: (
        <div>
          <p>{__('label.delete_message')}</p>
          <p>{__('role.name')}: {role.name}</p> 
        </div>
      ),
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: __('label.yes'),
      rejectLabel: __('label.no'),
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('roles.destroy', role.id), {
          preserveScroll: true,
          onSuccess: () => {
            setCurrRoles(prev => prev.filter(item => item.id !== role.id));
            onSuccess?.(); 
          },
        });
      },
      reject: () => {
        onSuccess?.(); // optional: reset loading if cancel 
      }
    });
  };

  return ( 
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('role.role')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{__('role.role')}</h2>
            <AuthButton
              permission='roles.create'
              label={__('button.add')}
              icon="pi pi-plus" 
              onClick={() => { 
                setLoadingButton({ id: null, action: 'add' });
                router.visit(route('roles.create'), {
                  onFinish: () => setLoadingButton({ id: null, action: null }),
                });
              }}
              loading={loadingButton.action === 'add'}
              disabled={loadingButton.action === 'add'}
            />
        </div>

        <DataTable
          key={tableKey}
          value={currRoles}
          paginator
          rows={roles.per_page}
          totalRecords={roles.total}
          first={(roles.current_page - 1) * roles.per_page}
          onPage={onPage}
          lazy
          dataKey="id"
          filters={filters} 
          onFilter={onFilterChange}
          filterDisplay="row"
          globalFilterFields={['name', 'label', 'description', 'is_active']} 
          emptyMessage={__('label.no_data_found')}
          tableStyle={{ minWidth: '60rem'}} 
          rowClassName={() => 'hoverable-row'}
        >
        <Column
          header="#"
          body={(_, options) => (options.rowIndex+1)}
          style={{ width: '3rem', textAlign: 'center' }}
        />    
        <Column
          field="name"
          header={__('role.name')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('role.name')}`}
          style={{ minWidth: '12rem' }}
        />  
        <Column
          field="label"
          header={__('role.label')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('role.label')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="description"
          header={__('role.description')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('role.description')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="is_active"
          header={__('role.is_active')}
          filter
          filterField="is_active"
          showFilterMenu={false}
          style={{ textAlign: 'center', minWidth: '12rem' }}
          filterElement={(options) => (
            <SelectButton
              value={options.value}
              onChange={(e) => options.filterApplyCallback(e.value)}
              options={isActiveOptions}
              optionLabel="label"
              optionValue="value"
              className="w-full"
            />
          )} 
            body={(rowData) => {
              const status = rowData.is_active===1 ? 'ON' : 'OFF';
              let color = '';
              switch (status) {
                case 'ON':
                  color = 'bg-green-200 text-green-800';
                  break;
                case 'OFF':
                  color = 'bg-red-200 text-red-800';
                  break;  
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
        <Column
          header={__('label.actions')}
          body={(rowData: Role) => (
            <div className="flex gap-2 justify-center">
              <AuthButton
                permission='roles.edit'
                icon="pi pi-pencil"
                className="p-button-sm"
                onClick={() => {
                  setLoadingButton({ id: rowData.id, action: 'edit' });
                  setTableKey((prev) => prev + 1);
                  router.visit(route('roles.edit', rowData.id), {
                    onFinish: () => setLoadingButton({ id: null, action: null }),
                  });
                }}
                loading={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                disabled={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
              />
              <AuthButton
                permission='roles.permissions'
                icon="pi pi-shield"
                className="p-button-sm"
                onClick={() => {
                  setLoadingButton({ id: rowData.id, action: 'permission' });
                  setTableKey((prev) => prev + 1);
                  router.visit(route('roles.permissions', rowData.id), {
                    onFinish: () => setLoadingButton({ id: null, action: null }),
                  });
                }}
                loading={loadingButton.id === rowData.id && loadingButton.action === 'permission'}
                disabled={loadingButton.id === rowData.id && loadingButton.action === 'permission'}
              />
              <AuthButton
                permission='roles.menus'
                icon="pi pi-bars"
                className="p-button-sm"
                onClick={() => {
                  setLoadingButton({ id: rowData.id, action: 'menu' });
                  setTableKey((prev) => prev + 1);
                  router.visit(route('roles.menus', rowData.id), {
                    onFinish: () => setLoadingButton({ id: null, action: null }),
                  });
                }}
                loading={loadingButton.id === rowData.id && loadingButton.action === 'menu'}
                disabled={loadingButton.id === rowData.id && loadingButton.action === 'menu'}
              /> 
              <AuthButton
                permission='roles.destroy'
                icon="pi pi-trash"
                className="p-button-danger p-button-sm"
                onClick={() => {
                  setLoadingButton({ id: rowData.id, action: 'delete' });
                  setTableKey((prev) => prev + 1);
                  confirmDelete(rowData, () => {
                    setLoadingButton({ id: null, action: null }); // manually reset in callback
                    setTableKey((prev) => prev + 1);
                  });
                }}
              loading={loadingButton.id === rowData.id && loadingButton.action === 'delete'}
              disabled={loadingButton.id === rowData.id && loadingButton.action === 'delete'}
              />              
            </div>
          )}
          style={{ width: '10rem', textAlign: 'center' }}
          headerStyle={{ textAlign: 'center' }}
        />
        </DataTable>
      </div>
    <ConfirmDialog />
    </AppLayout> 
  );
};

export default RoleIndexPage;
