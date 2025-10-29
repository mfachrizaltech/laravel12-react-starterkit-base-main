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

type Report = {
  id: number;
  name: string;
  description: string;
  query: string; 
  is_active: number 
}; 

type Props = {
  reports: {
    data: Report[];
    current_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  }; 
};

const ReportIndexPage: React.FC<Props> = ({ reports }) => {
  const toast = useRef<Toast>(null); 
  const { filters: initialFilters = {} } = usePage().props as any;

  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

  const { __ } = useLang();
  
  const [loadingButton, setLoadingButton] = useState<{
    id: number | null;
    action: string | null;
  }>({ id: null, action: null });

  const [currData, setCurrData] = useState(reports.data); 
    useEffect(() => {
      setCurrData(reports.data);
    }, [reports]);
      
  const [tableKey, setTableKey] = useState(0); 
  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 2 },
  ];

  const [filters, setFilters] = useState({ 
    name: { value: initialFilters?.filters?.name?.value || null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: initialFilters?.filters?.description?.value || null, matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS }, 
  });  
 
 
  const onFilterChange = (e: any) => {
    setFilters(e.filters);  
    // Send filters to Laravel
    router.get(route('reports-maintenance.index'), {
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
    { title: __('report.reports'), href: route('reports-maintenance.index') },
  ];

  const onPage = (e: DataTablePageEvent) => {
    const page = (e.page ?? 0) + 1;
    router.get(route('reports-maintenance.index'), { page, search: filters }, { preserveScroll: true, preserveState: true });
  };
  
  const confirmDelete = (report: Report, onSuccess?: () => void) => { 
    confirmDialog({
      message: (
        <div>
          <p>{__('label.delete_message')}</p>
          <p>{__('report.name')}: {report.name}</p> 
        </div>
      ),
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: __('label.yes'),
      rejectLabel: __('label.no'),
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('reports-maintenance.destroy', report.id), {
          preserveScroll: true,
          onSuccess: () => {
            setCurrData(prev => prev.filter(item => item.id !== report.id));
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
      <Head title={__('report.reports')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{__('report.reports')}</h2>
            <AuthButton
              permission='reports-maintenance.create'
              label={__('button.add')}
              icon="pi pi-plus" 
              onClick={() => { 
                setLoadingButton({ id: null, action: 'add' });
                router.visit(route('reports-maintenance.create'), {
                  onFinish: () => setLoadingButton({ id: null, action: null }),
                });
              }}
              loading={loadingButton.action === 'add'}
              disabled={loadingButton.action === 'add'}
            />
        </div>

        <DataTable
          key={tableKey}
          value={currData}
          paginator
          rows={reports.per_page}
          totalRecords={reports.total}
          first={(reports.current_page - 1) * reports.per_page}
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
          header={__('report.name')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('report.name')}`}
          style={{ minWidth: '12rem' }}
        />   
        <Column
          field="description"
          header={__('report.description')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('report.description')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="query"
          header={__('report.query')} 
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
          body={(rowData: Report) => (
            <div className="flex gap-2 justify-center">
              <AuthButton
                permission='reports-maintenance.edit'
                icon="pi pi-pencil"
                className="p-button-sm"
                onClick={() => {
                  setLoadingButton({ id: rowData.id, action: 'edit' });
                  setTableKey((prev) => prev + 1);
                  router.visit(route('reports-maintenance.edit', rowData.id), {
                    onFinish: () => setLoadingButton({ id: null, action: null }),
                  });
                }}
                loading={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                disabled={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
              />
              <AuthButton
                permission='reports-maintenance.parameter.edit'
                icon="pi pi-equals"
                className="p-button-sm"
                onClick={() => {
                  setLoadingButton({ id: rowData.id, action: 'parameter' });
                  setTableKey((prev) => prev + 1);
                  router.visit(route('reports-maintenance.parameter.edit', rowData.id), {
                    onFinish: () => setLoadingButton({ id: null, action: null }),
                  });
                }}
                loading={loadingButton.id === rowData.id && loadingButton.action === 'parameter'}
                disabled={loadingButton.id === rowData.id && loadingButton.action === 'parameter'}
              />
              <AuthButton
                permission='reports-maintenance.field.edit'
                icon="pi pi-list"
                className="p-button-sm" 
                onClick={() => {
                  setLoadingButton({ id: rowData.id, action: 'field' });
                  setTableKey((prev) => prev + 1);
                  router.visit(route('reports-maintenance.field.edit', rowData.id), {
                    onFinish: () => setLoadingButton({ id: null, action: null }),
                  });
                }}
                loading={loadingButton.id === rowData.id && loadingButton.action === 'field'}
                disabled={loadingButton.id === rowData.id && loadingButton.action === 'field'}
              /> 
              <AuthButton
                permission='reports-maintenance.destroy'
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

export default ReportIndexPage;
