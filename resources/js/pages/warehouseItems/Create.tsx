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
};

type ItemDetail = {
  id: number, 
  item_product_id : number | null; 
  quantity: number | null; 
};

const CreateWarehouseItemsPage: React.FC<Props> = ({
  rules, 
  itemProductOptions
}) => {
  const toast = useRef<Toast>(null);
 
  const { data, setData, post, processing } = useForm<{ 
      item_details: ItemDetail[],  
    }>({     
    item_details: []
  });   

  const { errors } = usePage<{ errors: Record<string, string> }>().props;
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const page = usePage();
  const flash = (page.props as any)?.flash || {};
  const { __ } = useLang();

  useEffect(() => {
    if (flash?.success) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    }
    if (flash?.error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }
  }, [flash]);

  useEffect(() => {
    setClientErrors(prev => ({ ...prev, ...errors }));
  }, [errors]); 

  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('warehouse.add_new_items'), href: route('warehouse-items.index') },
  ];

  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const [ItemDetails, setItemDetails]  = useState<ItemDetail[]>(() => [
      { id: Date.now(), item_product_id: null, quantity: 0 },
    ]);

  const addItemDetails = () => {
    setItemDetails([...ItemDetails, { id: Date.now(), item_product_id: 0, quantity: 1 }]);
  };
 
  const udatedItemDetail = (
    index: number,
    updates: Partial<ItemDetail>
  ) => {
    setItemDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };  

  const removeItemDetail = (id: number) => {
    setItemDetails(prev => prev.filter(item => item.id !== id));
  };
  
  useEffect(() => {
    if (shouldSubmit) { 
      post(route('warehouse-items.store'), {
        preserveScroll: true,
        onFinish: () => setShouldSubmit(false), // reset flag
      });
    }
  }, [shouldSubmit]);   
  
  const [tableKey, setTableKey] = useState(0); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullData = {
      ...data,
      item_details : ItemDetails,
    }; 
    const newErrors = ValidateField(fullData, rules, __);
    console.log(newErrors);
        console.log(rules);
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      setTableKey((prev) => prev + 1);
      return;
    }
    setClientErrors({});
    setData('item_details', ItemDetails);   
    setShouldSubmit(true); 
  };  
 
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('warehouse.add_new_items')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('warehouse.add_new_items')}</h2>

        <form onSubmit={handleSubmit}>
 
          {/* Order Detail Table */}
          <div className="my-4">
            <div className="flex justify-between mb-4">
              <Button icon="pi pi-plus" type="button" label={__('button.add')} onClick={addItemDetails} />
            </div>
            <DataTable value={ItemDetails} dataKey="id" key={tableKey}>
              <Column header="No" body={(_, options) => options.rowIndex + 1} style={{ width: '50px' }} />
              <Column
                header={
                  <>
                    {__('warehouse.item_product_id')}
                    {IsRequired('item_details.*.item_product_id', rules) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </>
                }
                body={(rowData, options) => {
                  const rowIndex = options.rowIndex;
                  const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.item_product_id;
                  return (
                    <div className="flex flex-col gap-1">
                      <Dropdown
                        value={rowData.item_product_id}
                        options={itemProductOptions}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="--Select--"
                        onChange={(e) => {
                            udatedItemDetail(options.rowIndex, { item_product_id: e.value });
                          }
                        }
                        style={{ width: '100%' }}
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
                    {__('warehouse.quantity')}
                    {IsRequired('item_details.*.quantity', rules) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </>
                }
                body={(rowData, options) => {
                  const rowIndex = options.rowIndex;
                  const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.quantity;    
                  return (
                  <div className="flex flex-col">  
                    <InputText
                      type="number"
                      value={rowData.quantity}
                      onChange={(e) =>
                        udatedItemDetail(options.rowIndex, { quantity: parseInt(e.target.value) }) 
                      }
                      className="w-full"
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
                body={(rowData) => (
                  <Button
                    type="button"
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm"
                    onClick={() => removeItemDetail(rowData.id)}
                  />
                )}
                style={{ textAlign: 'center', width: '100px' }}
              />
            </DataTable>
            {clientErrors.product_id && (
              <small className="text-red-500 block mt-2">{clientErrors.item_product_id}</small>
            )}
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
              permission='warehouse-items.store'
              type="submit" label={__('button.save')} loading={processing} />
          </div>
        </form>
      </div>
      
    </AppLayout>
  );
};

export default CreateWarehouseItemsPage;
