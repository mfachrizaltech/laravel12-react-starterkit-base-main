import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import {ValidateField, IsRequired} from '@/lib/RuleValidation';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext'; 
import AuthButton from '@/components/customs/auth-button';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown'; 
import { useLang } from '@/lib/lang';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

type Props = {
  rules: any;  
  itemProductOptions: any;
  itemStatusOptions: any;
};  

type ItemDetail = {
  id: number;
  item_product_id: number | null;
  in_stock: number;
  quantity: number; 
  status: string | null;
} 

const MultipleEditSupplierOrderPage: React.FC<Props> = ({
  rules,
  itemProductOptions,
  itemStatusOptions, 
}) => {
  const toast = useRef<Toast>(null);

  const [itemDetails, setItemDetails] = useState<ItemDetail[]>(() => [
    { id: Date.now(), item_product_id: null, in_stock: 0, quantity: 0, status: null },
  ]); 

  const { data, setData, put, processing } = useForm<{ 
      item_details: ItemDetail[],  
    }>({     
    item_details: []
  }); 

  const { errors } = usePage<{ errors: Record<string, string> }>().props;
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const page = usePage();
  const flash = (page.props as any)?.flash || {};
  const { __ } = useLang();
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  useEffect(() => {
    setClientErrors(prev => ({ ...prev, ...errors }));
  }, [errors]);

  useEffect(() => {
    if (flash?.success) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    }
    if (flash?.error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }
  }, [flash]);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('warehouse.multiple_edit'), href: route('supplier-orders.index') },
  ];

  const [shouldSubmit, setShouldSubmit] = useState(false);

  useEffect(() => {
    if (shouldSubmit) { 
      put(route('warehouse-items.multiple-update'), {
        preserveScroll: true,
        onFinish: () => setShouldSubmit(false), // reset flag
      });
    }
  }, [shouldSubmit]);   
 
  const [tableKey, setTableKey] = useState(0); 

  const addItemDetail = () => {
    setItemDetails([
      ...itemDetails,
      {
        id: Date.now(),
        item_product_id: 0,
        in_stock: 0,
        quantity: 0,
        status: null,
      },
    ]);
  };
  
  const updateItemDetail = (
    index: number,
    updates: Partial<ItemDetail>
  ) => {
    setItemDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
    setData('item_details', itemDetails);
  };  

  const removeItemDetail = (id: number) => {
    setItemDetails(prev => prev.filter(item => item.id !== id));
  }; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullData = {
      ...data,
      item_details: itemDetails,
    }; 
    const newErrors = ValidateField(fullData, rules, __); 
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      setTableKey((prev) => prev + 1);
      return;
    }
    setClientErrors({});
    setData('item_details', itemDetails);  
    setShouldSubmit(true); 
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('warehouse.multiple_edit')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('warehouse.multiple_edit')}</h2>

        <form onSubmit={handleSubmit}>
 
          {/* Product Table */}
          <div className="my-4">
            <div className="flex justify-between mb-4">
              <Button type='button' icon="pi pi-plus" label={__('button.add')} 
                disabled={itemProductOptions.length<=itemDetails.length}
                onClick={addItemDetail} />
            </div>
            <DataTable value={itemDetails} dataKey="id" key={tableKey}>
              <Column header="No" body={(_, options) => options.rowIndex + 1} style={{ width: '50px' }} />
              <Column
                header={__('warehouse.product')}
                body={(rowData, options) => {
                  const rowIndex = options.rowIndex;
                  const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.item_product_id;
                  return (
                  <div className="flex flex-col gap-1">  
                  <Dropdown
                    value={rowData.item_product_id}
                    options={itemProductOptions.map((option) => ({
                      ...option,
                      disabled: itemDetails.some(
                        (detail, i) =>
                          i !== options.rowIndex &&
                          detail.item_product_id === option.item_product_id
                      ),
                    }))}
                    optionLabel="name"
                    optionValue="item_product_id"  
                    placeholder="--Select--"
                    onChange={(e) => { 
                      const selectedItem = itemProductOptions.find((a) => a.item_product_id === e.value);
                      updateItemDetail(options.rowIndex, { item_product_id: selectedItem.item_product_id, in_stock: selectedItem.quantity });
                    }}
                    style={{ width: '100%' }}
                    filter
                  />
                  {errorMsg && (
                    <small className="text-red-500">
                      {errorMsg}
                    </small>
                  )}  
                  </div>
                  ); 
                }}
              />
              <Column
                header={
                  <>
                    {__('warehouse.item_product_id')}
                    {IsRequired('item_details.*.item_product_id', rules) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </>
                }
                body={(rowData) =>
                  itemProductOptions.find(
                    (p) => p.item_product_id === rowData.item_product_id
                  )?.quantity ?? 0
                }
                bodyStyle={{ textAlign: 'right' }} // aligns cell content to right
                headerStyle={{ textAlign: 'center' }} // optional: aligns header text to right
              />                     
              <Column
                header={__('warehouse.quantity')}
                body={(rowData, options) => {
                  const selectedProduct = itemProductOptions.find(
                    (p) => p.item_product_id === rowData.item_product_id
                  );
                  const maxQuantity = selectedProduct?.quantity ?? 0;
                  const isInvalid = rowData.quantity > maxQuantity;
                  const rowIndex = options.rowIndex;
                  const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.quantity;
                  return (
                    <div className="flex flex-col">
                      <InputText
                        type="number"
                        value={rowData.quantity}
                        max={maxQuantity}
                        min={0}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 0;
                          updateItemDetail(options.rowIndex, {
                            quantity: newQuantity > maxQuantity ? maxQuantity : newQuantity,
                          });
                        }}
                        className={`w-full ${isInvalid ? 'p-invalid' : ''}`}
                      />
                      {isInvalid && (
                        <small className="text-red-500">
                          {__('validation.max_quantity', { max: maxQuantity })}
                        </small>
                      )}
                    {errorMsg && (
                      <small className="text-red-500">
                        {errorMsg}
                      </small>
                    )}
                    </div>
                  );
                }}
              />
              <Column 
                header={__('warehouse.status')}
                body={(rowData, options) => {
                  const rowIndex = options.rowIndex;
                  const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.status;
                  return (
                  <div className="flex flex-col gap-1">  
                  <Dropdown 
                    options={itemStatusOptions}
                    value={rowData.status}
                    className="w-full"
                    placeholder="--Select--"
                    onChange={(e) => {
                      console.log(e.value);
                      updateItemDetail(options.rowIndex, { status: e.value });  
                    }}
                  />
                  {errorMsg && (
                      <small className="text-red-500">
                        {errorMsg}
                      </small>
                  )}
                  </div>
                );
                }}
              />
              <Column
                header={__('label.actions')}
                body={(rowData, options) => {
                  if (options.rowIndex !== 0) {
                    return (
                    <Button
                      icon="pi pi-trash"
                      className="p-button-danger p-button-sm"
                      onClick={() => removeItemDetail(rowData.id)}
                    />
                    )}
                  }} 
                style={{ textAlign: 'center', width: '100px' }}
              />
            </DataTable>
            {clientErrors.item_product_id && (
              <small className="text-red-500 block mt-2">{clientErrors.item_product_id}</small>
            )}
          </div>
          <div className="flex justify gap-2 font-bold">
            <span style={{ color: 'red' }}>* {__('label.required')} </span>
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
            <AuthButton
              permission='warehouse-items.multiple-update'
              type="submit" label={__('button.save')} loading={processing} />
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default MultipleEditSupplierOrderPage;
