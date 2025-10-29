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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

interface Supplier {
    id: number;
    name: string;
    address1: string;
    address2: string; 
    address3: string; 
    city: string; 
    country: string; 
    phone: string; 
} 

type Props = {
  suppliers: {
    data: Supplier[];
    current_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  };
};

const SuppliersIndexPage: React.FC<Props> = ({ suppliers }) => {
  const toast = useRef<Toast>(null); 
  const { filters: initialFilters = {} } = usePage().props as any;

  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

  const { __ } = useLang();

  const [currSuppliers, setCurrSuppliers] = useState(suppliers.data); 
    useEffect(() => {
      setCurrSuppliers(suppliers.data);
    }, [suppliers]);

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
    name: { value: initialFilters?.filters?.name?.value || null, matchMode: FilterMatchMode.CONTAINS },
    address1: { value: initialFilters?.address1?.code?.value || null, matchMode: FilterMatchMode.CONTAINS },
    address2: { value: initialFilters?.filters?.address2?.value || null, matchMode: FilterMatchMode.CONTAINS },
    address3: { value: initialFilters?.filters?.address3?.value || null, matchMode: FilterMatchMode.CONTAINS },
    city: { value: initialFilters?.filters?.city?.value || null, matchMode: FilterMatchMode.CONTAINS },
    country: { value: initialFilters?.filters?.country?.value || null, matchMode: FilterMatchMode.CONTAINS },
    phone: { value: initialFilters?.filters?.phone?.value || null, matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS }, 
  });  
 

  const onFilterChange = (e: any) => {
    setFilters(e.filters);
    console.log('onChangeFilter');
    // Send filters to Laravel
    router.get(route('suppliers.index'), {
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
    { title: __('supplier.suppliers'), href: route('suppliers.index') },
  ];

  const onPage = (e: DataTablePageEvent) => {
    const page = (e.page ?? 0) + 1;
    router.get(route('suppliers.index'), { page, search: filters }, { preserveScroll: true });
  };
 

  const confirmDelete1 = (id: number, onSuccess?: () => void) => {
    if (confirm(__('label.delete_message'))) {
      router.delete(route('suppliers.destroy', id), {
        preserveScroll: true,
        onSuccess: () => {
          setCurrSuppliers(prev =>
            prev.filter(item => item.id !== id)
          );
          onSuccess?.(); // Call the callback if provided
        },
      });
    }
  };   

  const confirmDelete = (supplier: Supplier, onSuccess?: () => void) => { 
    confirmDialog({
      message: (
        <div>
          <p>{__('label.delete_message')}</p>
          <p>{__('supplier.name')}: {supplier.name}</p> 
        </div>
      ),
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: __('label.yes'),
      rejectLabel: __('label.no'),
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('suppliers.destroy', supplier.id), {
          preserveScroll: true,
          onSuccess: () => {
            setCurrSuppliers(prev => prev.filter(item => item.id !== supplier.id));
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
          <h2 className="text-2xl font-bold">{__('supplier.suppliers')}</h2>
          <AuthButton
            permission='suppliers.create'
            label={__('button.add')}
            icon="pi pi-plus"
            onClick={() => { 
              setLoadingButton({ id: null, action: 'add' });
              router.visit(route('suppliers.create'), {
                onFinish: () => setLoadingButton({ id: null, action: null }),
              });
            }}
            loading={loadingButton.action === 'add'}
            disabled={loadingButton.action === 'add'}
          />           
        </div>

        <DataTable
          key={tableKey}
          value={currSuppliers}
          paginator
          rows={suppliers.per_page}
          totalRecords={suppliers.total}
          first={(suppliers.current_page - 1) * suppliers.per_page}
          onPage={onPage}
          lazy
          dataKey="id"
          filters={filters} 
          onFilter={onFilterChange}
          filterDisplay="row"
          globalFilterFields={['name', 'address1', 'address2', 'address3', 'city', 'country', 'phone']} 
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
          field="name"
          header={__('supplier.name')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.name')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="address1"
          header={__('supplier.address1')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.address1')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="address2"
          header={__('supplier.address2')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.address2')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="address3"
          header={__('supplier.address3')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.address3')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="city"
          header={__('supplier.city')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.city')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="country"
          header={__('supplier.country')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.country')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="phone"
          header={__('supplier.phone')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('code.phone')}`}
          style={{ minWidth: '12rem' }}
        />
          <Column
            header={__('label.actions')}
            body={(rowData: Supplier) => (
              <div className="flex gap-2 justify-center"> 
                <AuthButton
                  permission='suppliers.edit'
                  icon="pi pi-pencil"
                  className="p-button-sm"
                  onClick={() => {
                    setLoadingButton({ id: rowData.id, action: 'edit' });
                    setTableKey((prev) => prev + 1);
                    router.visit(route('suppliers.edit', rowData.id), {
                      onFinish: () => setLoadingButton({ id: null, action: null }),
                    });
                  }}
                  loading={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                  disabled={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                />
                <AuthButton
                  permission='suppliers.destroy'
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

export default SuppliersIndexPage;
