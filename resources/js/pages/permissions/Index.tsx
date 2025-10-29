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
import { SelectButton } from 'primereact/selectbutton';
import { FilterMatchMode } from 'primereact/api';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface Permission {
    id: number;
    name: string;
    module: string;
    description: string; 
}

type Props = {
  permissions: {
    data: Permission[];
    current_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  };
};

const PermissionIndexPage: React.FC<Props> = ({ permissions }) => {
  const toast = useRef<Toast>(null); 
  const { filters: initialFilters = {} } = usePage().props as any;

  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

  const { __ } = useLang();

  const [currPermissions, setCurrPermissions] = useState(permissions.data); 
    useEffect(() => {
      setCurrPermissions(permissions.data);
    }, [permissions]);

  const [loadingButton, setLoadingButton] = useState<{
    id: number | null;
    action: string | null;
  }>({ id: null, action: null });
 
  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 0 },
  ];

  const [tableKey, setTableKey] = useState(0); 

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: initialFilters?.filters?.name?.value || null, matchMode: FilterMatchMode.CONTAINS },
    module: { value: initialFilters?.filters?.module?.value || null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: initialFilters?.filters?.description?.value || null, matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS }, 
  }); 

  const onFilterChange = (e: any) => {
    setFilters(e.filters);
    console.log('onChangeFilter');
    // Send filters to Laravel
    router.get(route('permissions.index'), {
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
    { title: __('permission.permission'), href: route('permissions.index') },
  ];

  const onPage = (e: DataTablePageEvent) => {
    const page = (e.page ?? 0) + 1;
    router.get(route('permissions.index'), { page, search: filters }, { preserveScroll: true });
  };
   
  const confirmDelete = (permission: Permission, onSuccess?: () => void) => { 
    confirmDialog({
      message: (
        <div>
          <p>{__('label.delete_message')}</p>
          <p>{__('permission.name')}: {permission.name}</p>
          <p>{__('permission.module')}: {permission.module}</p>
        </div>
      ),
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: __('label.yes'),
      rejectLabel: __('label.no'),
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('permissions.destroy', permission.id), {
          preserveScroll: true,
          onSuccess: () => {
            setCurrPermissions(prev => prev.filter(item => item.id !== permission.id));
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
      <Head title={__('permission.permission')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{__('permission.permission')}</h2>
            <AuthButton
              permission='permissions.create'
              label={__('button.add')}
              icon="pi pi-plus"
              onClick={() => { 
                setLoadingButton({ id: null, action: 'add' });
                router.visit(route('permissions.create'), {
                  onFinish: () => setLoadingButton({ id: null, action: null }),
                });
              }}
              loading={loadingButton.action === 'add'}
              disabled={loadingButton.action === 'add'}
            />           
        </div>

        <DataTable
          key={tableKey}
          value={currPermissions}
          paginator
          rows={permissions.per_page}
          totalRecords={permissions.total}
          first={(permissions.current_page - 1) * permissions.per_page}
          onPage={onPage}
          lazy
          dataKey="id"
          filters={filters} 
          onFilter={onFilterChange}
          filterDisplay="row"
          globalFilterFields={['name', 'module', 'description', 'is_active']} 
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
          header={__('permission.name')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('permission.name')}`}
          style={{ minWidth: '12rem' }}
        /> 
        <Column
          field="module"
          header={__('permission.module')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('permission.module')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="description"
          header={__('permission.description')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('permission.description')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="is_active"
          filterPlaceholder={`${__('label.search_by')} ${__('permission.is_active')}`}
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
            body={(rowData: Permission) => (
              <div className="flex gap-2 justify-center"> 
                <AuthButton
                  permission='permissions.edit'
                  icon="pi pi-pencil"
                  className="p-button-sm"
                  onClick={() => {
                    setLoadingButton({ id: rowData.id, action: 'edit' });
                    setTableKey((prev) => prev + 1);
                    router.visit(route('permissions.edit', rowData.id), {
                      onFinish: () => setLoadingButton({ id: null, action: null }),
                    });
                  }}
                  loading={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                  disabled={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                />
                <AuthButton
                  permission='permissions.destroy'
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
            style={{ width: '18rem', textAlign: 'center' }}
            headerStyle={{ textAlign: 'center' }}
          />
        </DataTable>
      </div>
    <ConfirmDialog />
    </AppLayout>
  );
};

export default PermissionIndexPage;
