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

interface Code {
    id: number;
    code_group: string;
    code: string;
    value1: string;
    value2: string;
    order_no: number;
    tag1: string;
    tag2: string;
    tag3: string;
    is_active: number;  
} 

type Props = {
  codes: {
    data: Code[];
    current_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  };
};

const PermissionIndexPage: React.FC<Props> = ({ codes }) => {
  const toast = useRef<Toast>(null); 
  const { filters: initialFilters = {} } = usePage().props as any;

  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

  const { __ } = useLang();

  const [currCodes, setCurrCodes] = useState(codes.data); 
    useEffect(() => {
      setCurrCodes(codes.data);
    }, [codes]);

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
    code_group: { value: initialFilters?.filters?.code_group?.value || null, matchMode: FilterMatchMode.CONTAINS },
    code: { value: initialFilters?.filters?.code?.value || null, matchMode: FilterMatchMode.CONTAINS },
    value1: { value: initialFilters?.filters?.value1?.value || null, matchMode: FilterMatchMode.CONTAINS },
    value2: { value: initialFilters?.filters?.value2?.value || null, matchMode: FilterMatchMode.CONTAINS },
    tag1: { value: initialFilters?.filters?.tag1?.value || null, matchMode: FilterMatchMode.CONTAINS },
    tag2: { value: initialFilters?.filters?.tag2?.value || null, matchMode: FilterMatchMode.CONTAINS },
    tag3: { value: initialFilters?.filters?.tag3?.value || null, matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS }, 
  }); 
 

  const onFilterChange = (e: any) => {
    setFilters(e.filters);
    console.log('onChangeFilter');
    // Send filters to Laravel
    router.get(route('codes.index'), {
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
    { title: __('code.code'), href: route('codes.index') },
  ];

  const onPage = (e: DataTablePageEvent) => {
    const page = (e.page ?? 0) + 1;
    router.get(route('codes.index'), { page, search: filters }, { preserveScroll: true });
  };
 

  const confirmDelete1 = (id: number, onSuccess?: () => void) => {
    if (confirm(__('label.delete_message'))) {
      router.delete(route('codes.destroy', id), {
        preserveScroll: true,
        onSuccess: () => {
          setCurrCodes(prev =>
            prev.filter(item => item.id !== id)
          );
          onSuccess?.(); // Call the callback if provided
        },
      });
    }
  };   

  const confirmDelete = (code: Code, onSuccess?: () => void) => { 
    confirmDialog({
      message: (
        <div>
          <p>{__('label.delete_message')}</p>
          <p>{__('code.code_group')}: {code.code_group}</p>
          <p>{__('code.code')}: {code.code}</p>
        </div>
      ),
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: __('label.yes'),
      rejectLabel: __('label.no'),
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('codes.destroy', code.id), {
          preserveScroll: true,
          onSuccess: () => {
            setCurrCodes(prev => prev.filter(item => item.id !== code.id));
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
      <Head title={__('code.codes')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{__('code.codes')}</h2>
          <AuthButton
            permission='codes.create'
            label={__('button.add')}
            icon="pi pi-plus"
            onClick={() => { 
              setLoadingButton({ id: null, action: 'add' });
              router.visit(route('codes.create'), {
                onFinish: () => setLoadingButton({ id: null, action: null }),
              });
            }}
            loading={loadingButton.action === 'add'}
            disabled={loadingButton.action === 'add'}
          />           
        </div>

        <DataTable
          key={tableKey}
          value={currCodes}
          paginator
          rows={codes.per_page}
          totalRecords={codes.total}
          first={(codes.current_page - 1) * codes.per_page}
          onPage={onPage}
          lazy
          dataKey="id"
          filters={filters} 
          onFilter={onFilterChange}
          filterDisplay="row"
          globalFilterFields={['code_group', 'code', 'value1', 'value2', 'tag1', 'tag2', 'tag3', 'is_active']} 
          emptyMessage={__('label.no_data_found')}
          tableStyle={{ minWidth: '60rem' }}
          rowClassName={() => 'hoverable-row'}
        >
        <Column
          header="#"
          body={(_, options) => (options.rowIndex+1)}
          style={{ width: '3rem', textAlign: 'center' }}
        />
        <Column
          field="code_group"
          header={__('code.code_group')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.code_group')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="code"
          header={__('code.code')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.code')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="value1"
          header={__('code.value1')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.value1')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="value2"
          header={__('code.value2')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.value2')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="tag1"
          header={__('code.tag1')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.tag1')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="tag2"
          header={__('code.tag2')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.tag2')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="tag3"
          header={__('code.tag3')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.tag3')}`}
          style={{ minWidth: '12rem' }}
        />                                    
        <Column
          field="is_active"
          header={__('code.is_active')}
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
            body={(rowData: Code) => (
              <div className="flex gap-2 justify-center"> 
                <AuthButton
                  permission='codes.edit'
                  icon="pi pi-pencil"
                  className="p-button-sm"
                  onClick={() => {
                    setLoadingButton({ id: rowData.id, action: 'edit' });
                    setTableKey((prev) => prev + 1);
                    router.visit(route('codes.edit', rowData.id), {
                      onFinish: () => setLoadingButton({ id: null, action: null }),
                    });
                  }}
                  loading={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                  disabled={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                />
                <AuthButton
                  permission='codes.destroy'
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
