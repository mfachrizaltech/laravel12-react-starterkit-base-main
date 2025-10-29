import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { useRef, useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext'; 
import AuthButton from '@/components/customs/auth-button';
// import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown'; 
import { useLang } from '@/lib/lang';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

type WarehouseItem = {
  id: number, 
  item_product_id : number; 
  item_product: any;
  product_id: string;
  status: string;
  remarks: string;
};
 

type Props = {  
  itemStatusOptions: any;
  itemProducts: {
    data: WarehouseItem[];
    current_page: number;
    per_page: number;
    total: number;
  };
  itemProductId: string;
  status: string;
  flash?: {
    success?: string;
    error?: string;
  };
};  

const EditWarehouseItemsPage: React.FC<Props> = ({ 
  itemStatusOptions,
  itemProducts,
  itemProductId,
  status
}) => {
  const toast = useRef<Toast>(null);
 
  const page = usePage();
  const flash = (page.props as any)?.flash || {};
  const { __ } = useLang();
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [loadingButton, setLoadingButton] = useState<{
    id: number | null;
    action: string | null;
  }>({ id: null, action: null });
  
  useEffect(() => {
    if (flash?.success) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    }
    if (flash?.error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }
  }, [flash]);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('warehouse.add_new_items'), href: route('warehouse-items.index') },
  ];

  const [WarehouseItems, setWarehouseItems] = useState(itemProducts.data);
  const [tableKey, setTableKey] = useState(0); 
  const { auth } = usePage().props;

  const onRowEditComplete = async (e: any) => {
    const { newData } = e;

    // Optimistically update local UI
    setWarehouseItems((prev) =>
      prev.map((item) => (item.id === newData.id ? newData : item))
    );

    try {
      await axios.put(route('warehouse-items.update', newData.id), {
        product_id: newData.product_id,
        status: newData.status,
        remarks: newData.remarks,
      });

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: flash.success,
      });
    } catch (error) {
      console.error('Update failed', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: flash.error,
      });
    }
  };
 

  const confirmDelete = async (warehouseItem: WarehouseItem, onSuccess?: () => void) => { 
    confirmDialog({
      message: (
        <div>
          <p>{__('label.delete_message')}</p>
          <p>{__('warehouse.product')}: {warehouseItem.item_product.name}</p>
          <p>{__('warehouse.product_id')}: {warehouseItem.product_id}</p>
          <p>{__('warehouse.status')}: {warehouseItem.status}</p>
        </div>
      ),
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: __('label.yes'),
      rejectLabel: __('label.no'),
      acceptClassName: 'p-button-danger', 

      accept: () => {
      try {
          axios.delete(route('warehouse-items.destroy', warehouseItem.id));

          setWarehouseItems(prev =>
            prev.filter(item => item.id !== warehouseItem.id)
          );

          toast.current?.show({
            severity: 'success',
            summary: 'Deleted',
            detail: flash.success,
          });
        } catch (error) { 
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: flash.error,
          });
        }
        onSuccess?.(); 
      },

      reject: () => {
        onSuccess?.(); // optional: reset loading if cancel  
      }
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('warehouse.update_items')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('warehouse.update_items')}</h2> 
          {/* Order Detail Table */}
          <div className="my-4"> 
          <DataTable
            key={tableKey}
            value={WarehouseItems}
            dataKey="id"
            editMode="row"
            onRowEditComplete={onRowEditComplete}
          >
              <Column header="No" body={(_, options) => options.rowIndex + 1} style={{ width: '50px' }} />
              <Column header={__('warehouse.product')}  
                      body={(rowData: WarehouseItem) => {  
                    return rowData.item_product.name;
                  }}
                  headerStyle={{ textAlign: 'center' }}
              />
              <Column
                field="product_id"
                header={__('warehouse.product_id')}
                editor={(options) => (
                  <InputText
                    value={options.value}
                    onChange={(e) => options.editorCallback(e.target.value)}
                    className="w-full"
                  />
                )}
              />
              <Column
                field="status"
                header={__('warehouse.status')}
                editor={(options) => (
                  <Dropdown
                    value={options.value}
                    options={itemStatusOptions}
                    onChange={(e) => options.editorCallback(e.value)}
                    className="w-full"
                    placeholder="--Select--"
                  />
                )}
              />
              <Column
                field="remarks"
                header={__('warehouse.remarks')}
                editor={(options) => (
                  <InputText
                    value={options.value}
                    onChange={(e) => options.editorCallback(e.target.value)}
                    className="w-full"
                  />
                )}
              />
              <Column
                rowEditor={auth.permissions.includes('warehouse-items.update')}
                header="Edit"
                bodyStyle={{ textAlign: 'center' }}
                style={{ width: '80px' }}
              />                       
              <Column
                header={__('label.actions')}
                body={(rowData) => (
                <AuthButton
                  permission="warehouse-items.destroy"
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
                  loading={loadingButton.action === 'delete'}
                  disabled={loadingButton.action === 'delete'}
                />


                )}
                style={{ textAlign: 'center', width: '100px' }}
              />
            </DataTable> 
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2">
            <AuthButton
              permission='customers.index'
              type="button"
              label={__('button.cancel')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('warehouse-items.index'), {
                  onFinish: () => setIsNavigatingBack(false),
                });
              }}
              loading={isNavigatingBack}
            />
          </div> 
      </div>
      <ConfirmDialog />
    </AppLayout>
  );
};

export default EditWarehouseItemsPage;
