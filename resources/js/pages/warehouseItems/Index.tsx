import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import { useLang } from '@/lib/lang';
import { type BreadcrumbItem } from '@/types'; 
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import AuthButton from '@/components/customs/auth-button'; 
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon'; 

export default function WarehouseIndex() {
  const { summary, filters } = usePage().props;
  const toast = useRef<Toast>(null);

  const { data, setData, get } = useForm({ search: filters.search || '' });
  const { __ } = useLang();

  const [tableKey, setTableKey] = useState(0); 

  const [loadingButton, setLoadingButton] = useState<{
    id: number | null;
    action: string | null;
  }>({ id: null, action: null });
    
  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('warehouse.warehouse'), href: route('warehouse-items.index') },
  ];

  
  const onPage = (e) => {
    const page = e.page + 1;
    router.get(route('warehouse-items.index'), {
      search: data.search,
      page: page,
    }, {
      preserveScroll: true,
    });
  };

    const header = (
      <div className="flex justify-between items-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            placeholder={__('label.search')}
            value={data.search}
            onChange={(e) => setData('search', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                router.get(route('warehouse-items.index'), { search: e.currentTarget.value }, { preserveScroll: true });
              }
            }}
          />
        </IconField>
      </div>
    );
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('warehouse.warehouse')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{__('warehouse.warehouse')}</h2>
          <div className="flex justify-end gap-2 mt-4">
          <AuthButton
            permission='warehouse-items.create'
            label={__('button.add')}
            icon="pi pi-plus"
            onClick={() => { 
              setLoadingButton({ id: null, action: 'add' });
              router.visit(route('warehouse-items.create'), {
                onFinish: () => setLoadingButton({ id: null, action: null }),
              });
            }}
            loading={loadingButton.action === 'add'}
            disabled={loadingButton.action === 'add'}
          />
          <AuthButton
            permission='warehouse-items.multiple-edit'
            label={__('button.edit')}
            icon="pi pi-sign-out"
            onClick={() => { 
              setLoadingButton({ id: null, action: 'multiple-edit' });
              router.visit(route('warehouse-items.multiple-edit'), {
                onFinish: () => setLoadingButton({ id: null, action: null }),
              });
            }}
            loading={loadingButton.action === 'multiple-edit'}
            disabled={loadingButton.action === 'multiple-edit'}
          /> 
        </div>
      </div>
        <DataTable
          value={summary.data}
          key={tableKey}
          paginator
          rows={summary.per_page}
          totalRecords={summary.total}
          first={(summary.current_page - 1) * summary.per_page}
          onPage={onPage}
          header={header}
          lazy
          responsiveLayout="scroll"
          rowClassName={() => 'hoverable-row'}
        >
          <Column field="product_name" header={__('warehouse.product_item')} />
          <Column field="quantity_in" header={__('warehouse.in_stock')} style={{ textAlign: 'center' }} />
          <Column field="quantity_out" header={__('warehouse.out')} style={{ textAlign: 'center' }} />
          <Column field="quantity_missing" header={__('warehouse.missing')} style={{ textAlign: 'center' }} />
          <Column field="quantity_damaged" header={__('warehouse.damaged')} style={{ textAlign: 'center' }} />
          <Column
            header={__('label.actions')}
            body={(rowData: any) => (
              <div className="flex gap-2 justify-center"> 
                <AuthButton
                  permission='warehouse-items.edit'
                  icon="pi pi-pencil"
                  className="p-button-sm"
                  onClick={() => {
                    setLoadingButton({ id: rowData.item_product_id, action: 'edit' });
                    setTableKey((prev) => prev + 1);
                    router.visit(route('warehouse-items.edit', rowData.item_product_id), {
                      onFinish: () => setLoadingButton({ id: null, action: null }),
                    });
                  }}
                  loading={loadingButton.id === rowData.item_product_id && loadingButton.action === 'edit'}
                  disabled={loadingButton.id === rowData.item_product_id && loadingButton.action === 'edit'}
                />
              </div>
            )}
            style={{ width: '15rem', textAlign: 'center' }}
          />
        </DataTable>
      </div>
    </AppLayout>
  );
}
