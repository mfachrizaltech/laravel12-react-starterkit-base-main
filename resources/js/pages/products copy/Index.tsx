import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import { useLang } from '@/lib/lang';
import { type BreadcrumbItem } from '@/types';
import { FormatRupiah } from '@/lib/Formatter'; 
import { Head, usePage, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast';  
import { FilterMatchMode } from 'primereact/api';
import { SelectButton } from 'primereact/selectbutton';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

type Product = {
  id: number; 
  name: string;
  descriptions: string;
  price: number;
  is_active: number;
}

type Props = {
  products: {
    data: any[];
    current_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  };
  printTypeOptions: any;
};

const ProductIndexPage: React.FC<Props> = ({ products, printTypeOptions }) => {
  const toast = useRef<Toast>(null); 
  const { filters: initialFilters = {} } = usePage().props as any;

  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

  const { __ } = useLang();
  
  const [loadingButton, setLoadingButton] = useState<{
    id: number | null;
    action: string | null;
  }>({ id: null, action: null });

  const [currProducts, setProducts] = useState(products.data); 
    useEffect(() => {
      setProducts(products.data);
    }, [products]);
      
  const [tableKey, setTableKey] = useState(0); 

  const [filters, setFilters] = useState({
    print_type: { value: null, matchMode: FilterMatchMode.EQUALS },
    name: { value: initialFilters?.filters?.name?.value || null, matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS }, 
  }); 

  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 2 },
  ];

  const onFilterChange = (e: any) => {
    setFilters(e.filters); 
    console.log(e.filter);
    // Send filters to Laravel
    router.get(route('products.index'), {
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
    { title: __('product.product'), href: route('products.index') },
  ];

  const onPage = (e: DataTablePageEvent) => {
    const page = (e.page ?? 0) + 1;
    router.get(route('products.index'), { page, search: filters }, { preserveScroll: true, preserveState: true });
  }; 
 
  const confirmDelete = (product: Product, onSuccess?: () => void) => { 
    console.log(product);
    confirmDialog({
      message: (
        <div>
          <p>{__('label.delete_message')}</p>
          <p>{__('product.name')}: {product.name}</p>
          <p>{__('product.descriptions')}: {product.descriptions}</p>
          <p>{__('product.price')}: {product.price}</p>
        </div>
      ),
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: __('label.yes'),
      rejectLabel: __('label.no'),
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('products.destroy', product.id), {
          preserveScroll: true,
          onSuccess: () => {
            setProducts(prev => prev.filter(item => item.id !== product.id));
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
      <Head title={__('product.product')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{__('product.product')}</h2>
          <AuthButton
            permission='products.create'
            label={__('button.add')}
            icon="pi pi-plus" 
            onClick={() => { 
              setLoadingButton({ id: null, action: 'add' });
              router.visit(route('products.create'), {
                onFinish: () => setLoadingButton({ id: null, action: null }),
              });
            }}
            loading={loadingButton.action === 'add'}
            disabled={loadingButton.action === 'add'}
          />
        </div>

        <DataTable
          key={tableKey}
          value={currProducts}
          paginator
          rows={products.per_page}
          totalRecords={products.total}
          first={(products.current_page - 1) * products.per_page}
          onPage={onPage}
          lazy
          dataKey="id"
          filters={filters} 
          onFilter={onFilterChange}
          filterDisplay="row"
          globalFilterFields={['print_type', 'name', 'is_active']} 
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
          header={__('product.name')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('product.name')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="descriptions"
          header={__('product.descriptions')}
          filter
          filterPlaceholder={`${__('label.search_by')} ${__('product.descriptions')}`}
          style={{ minWidth: '12rem' }}
        />         
        <Column header={__('product.price')}  
          body={(rowData) => 
            FormatRupiah(rowData.price)
          }
          style={{ textAlign: 'right' }}   
          headerStyle={{ textAlign: 'center' }}
        />      
        <Column
          field="is_active"
          header={__('product.is_active')}
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
                  color = 'bg-gray-100 text-gray-700';
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
          body={(rowData: Product) => (
            <div className="flex gap-2 justify-center">
              <AuthButton
                permission='products.show'
                type="button"
                icon="pi pi-eye"
                className="p-button-info p-button-sm"
                onClick={() => {
                setLoadingButton({ id: rowData.id, action: 'show' });
                setTableKey((prev) => prev + 1);
                router.visit(route('products.show', rowData.id), {
                    onFinish: () => setLoadingButton({ id: null, action: null }),
                });
                }}
                loading={loadingButton.id === rowData.id && loadingButton.action === 'show'}
                disabled={loadingButton.id === rowData.id && loadingButton.action === 'show'}
              />
              <AuthButton
                permission='products.edit'
                icon="pi pi-pencil"
                className="p-button-sm"
                onClick={() => {
                  setLoadingButton({ id: rowData.id, action: 'edit' });
                  setTableKey((prev) => prev + 1);
                  router.visit(route('products.edit', rowData.id), {
                    onFinish: () => setLoadingButton({ id: null, action: null }),
                  });
                }}
                loading={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                disabled={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
              />
              <AuthButton
                permission='products.destroy'
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

export default ProductIndexPage;
