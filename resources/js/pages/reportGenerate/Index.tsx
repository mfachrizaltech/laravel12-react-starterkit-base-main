import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import { useLang } from '@/lib/lang';
import { type BreadcrumbItem } from '@/types'; 
import { Head, usePage, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from '@inertiajs/react';
import { Toast } from 'primereact/toast';  
import { FilterMatchMode } from 'primereact/api'; 

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
  const [currData, setCurrData] = useState(reports.data); 
    useEffect(() => {
      setCurrData(reports.data);
    }, [reports]);
      
  const [tableKey, setTableKey] = useState(0);  
  const [filters, setFilters] = useState({ 
    name: { value: initialFilters?.filters?.name?.value || null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: initialFilters?.filters?.description?.value || null, matchMode: FilterMatchMode.CONTAINS },
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
   
  return ( 
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('report.reports')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{__('report.reports')}</h2> 
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
          body={(rowData) => (
            <Link 
              href={route('reports-generate.generate', rowData.id)} 
              className="text-blue-500 hover:underline"
            >
              {rowData.name}
            </Link>
          )}
        />     
        <Column
          field="description"
          header={__('report.description')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('report.description')}`}
          style={{ minWidth: '12rem' }}
        />  
        </DataTable>
      </div>    
    </AppLayout> 
  );
};

export default ReportIndexPage;
