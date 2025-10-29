import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import { useLang } from '@/lib/lang';
import { type BreadcrumbItem } from '@/types';
import {ValidateField, IsRequired, SetDeepValue} from '@/lib/RuleValidation';  
import { Head, usePage, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AuthButton from '@/components/customs/auth-button';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast'; 
import { Dialog } from 'primereact/dialog'; 
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

import { FilterMatchMode } from 'primereact/api';

type OrderDetailMedia = { 
  id: number;
  name: string;
  original_name: string; 
};

type OrderDetailLogWork = {
  id?: number;
  operator_id: number | null;
  printer_id: number | null;
  quantity: number;
  start_work?: string | null;
  finish_work?: string | null;
  print_status: string | null;
  status: string | null;
  remarks: string | null;
}
    
type Product = {
  id: number;
  print_type: string,
  name: string;
  length: number;
  width: number;
  price: number;  
};

type OrderDetail = { 
  id: number;
  product: Product;
  product_id: number;
  length: number;
  width: number;
  quantity: number;
  price: number;
  total_amount: number; 
  order_media: OrderDetailMedia[];
  media: File[];
};

type Props = {
  rules: any;
  orderDetailStatusOptions: any;
  printStatusOptions: any;
  operatorOptions: any;
  printerOptions: any;
  productList: any;
  workOrderDetails: {
    data: any[];
    current_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  };
};

const WorkOrderIndexPage: React.FC<Props> = ({ rules, orderDetailStatusOptions, printStatusOptions, operatorOptions, printerOptions, productList, workOrderDetails }) => {
  const toast = useRef<Toast>(null); 
  const { filters: initialFilters = {} } = usePage().props as any;

  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

  const { __ } = useLang();

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [tableLogWorkKey, setTableLogWorkKey] = useState(0); 
    
  const [currWorkOrderDetails, setCurrWorkOrderDetails] = useState(workOrderDetails.data); 
  
  const [tableKey, setTableKey] = useState(0); 
  const [fileDialogVisible, setFileDialogVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<OrderDetailMedia[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
   
  const [logWorkDialogVisible, setLogWorkDialogVisible] = useState(false);
  const [dialogOrderDetailLogWork, setDialogOrderDetailLogWork] = useState<OrderDetailLogWork[]>([]); 
 
  const [filters, setFilters] = useState({
    order_id: { value: initialFilters?.filters?.order_id?.value || null, matchMode: FilterMatchMode.CONTAINS },
    customer_name: { value: initialFilters?.filters?.customer_name?.value || null, matchMode: FilterMatchMode.CONTAINS },
    product_id: { value: initialFilters?.filters?.product_id?.value != null ? Number(initialFilters.filters.product_id.value) : null, matchMode: FilterMatchMode.EQUALS},
    status: { value: initialFilters?.filters?.status?.value || null, matchMode: FilterMatchMode.EQUALS },
  });
 
  const [loadingButton, setLoadingButton] = useState<{
      action:  'back' | 'edit' | 'save' | 'approved' | 'rejected' | null;
  }>({ action: null });

  const updateOrderDetailLogWork = (
    index: number,
    updates: Partial<OrderDetailLogWork>
  ) => {
    setDialogOrderDetailLogWork((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        // Start with existing item
        const updatedItem = { ...item, ...updates };

        // Update status based on start/finish values
        if ('start_work' in updates || 'finish_work' in updates) {
          if (updatedItem.start_work != null && updatedItem.finish_work == null) {
            updatedItem.status = 'PROCESSING';
          } else if (updatedItem.start_work != null && updatedItem.finish_work != null) {
            updatedItem.status = 'FINISHED';
          } else {
            updatedItem.status = 'PENDING';
          }
        }
        return updatedItem;
      })
    );
  };  

  const [globalFilter, setGlobalFilter] = useState('');

  const onFilterChange = (e: any) => {
    setFilters(e.filters); 
    // Send filters to Laravel
    router.get(route('work-orders.index'), {
      filters: e.filters,
    }, { 
      // preserveState: true,
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
    { title: __('workOrder.workOrder'), href: route('work-orders.index') },
  ];

  const onPage = (e: DataTablePageEvent) => {
    const page = (e.page ?? 0) + 1;
    router.get(route('work-orders.index'), { page, search: filters }, { preserveScroll: true });
  };
 
  const getTotal = (printStatus: string, orderDetails: any) => { 
    const total = orderDetails.filter((log: OrderDetailLogWork) => log.status === 'FINISHED' && log.print_status === printStatus)
    .reduce((sum: number, log: OrderDetailLogWork) => sum + Number(log.quantity), 0);
    return total;
  }
    
  const header = (
    <div className="flex justify-between items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={onFilterChange}
          placeholder="Global Search"
        />
      </span>
    </div>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('workOrder.workOrder')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{__('workOrder.workOrder')}</h2> 
        </div>

        <DataTable
          key={tableKey}
          value={currWorkOrderDetails}
          paginator
          rows={workOrderDetails.per_page}
          totalRecords={workOrderDetails.total}
          first={(workOrderDetails.current_page - 1) * workOrderDetails.per_page}
          onPage={onPage}
          lazy
          dataKey="id"
          filters={filters} 
          onFilter={onFilterChange}
          filterDisplay="row"
          globalFilterFields={['order_id', 'customer_name', 'product', 'status']}
          rowClassName={() => 'hoverable-row'}           
          emptyMessage={__('label.no_data_found')}
          tableStyle={{ minWidth: '60rem' }}
        >
        <Column
          header="#"
          body={(_, options) => (options.rowIndex+1)}
          style={{ width: '3rem', textAlign: 'center' }}
        />
        <Column
          field="order.order_id"
          header={__('order.order_id')}
          filter
          filterField="order_id"
          filterMatchMode="contains"
          showFilterMenu={false}
          filterPlaceholder={`${__('label.search_by')} ${__('order.order_id')}`}
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="order.customer_name"
          header={__('order.customer_name')}
          filter
          filterField="customer_name"
          filterMatchMode="contains"
          showFilterMenu={false}
          filterPlaceholder={`${__('label.search_by')} ${__('order.customer_name')}`}
          style={{ minWidth: '12rem' }}
        /> 
        <Column
          field="product_id"
          header={__('order.product')}
          showFilterMenu={false}
          filter
          filterField="product_id"
          filterMatchMode="equals"
          style={{ minWidth: '12rem' }}
          filterElement={(options) => (
            <Dropdown
              value={options.value}
              options={productList}
              optionLabel="name"
              optionValue="id" 
              onChange={(e) => options.filterApplyCallback?.(e.value)}
              placeholder={`${__('label.search_by')} ${__('order.product')}`}
              className="p-column-filter"
              showClear
            />
          )}
          body={(rowData) => {
            return (rowData.product.name);
          }}
        />
        <Column header={__('order.quantity')}  
          body={(rowData) => {
            const totalFinishedQuantity = getTotal('NORMAL', rowData.order_log_works) ?? 0;
            const totalReprintFinishedQuantity = getTotal('REPRINT', rowData.order_log_works) ?? 0; 
            return (
              <div>
              <span style={{ color: 'black' }}>{rowData.quantity}</span>
              <span style={{ color: 'blue' }}>/{totalFinishedQuantity}</span>
              <span style={{ color: 'red' }}>/{totalReprintFinishedQuantity}</span>
              </div> 
              );
            }}
            headerStyle={{ textAlign: 'center' }}
        /> 
        {/* <Column
          header={__('order.add_ons')} 
          body={(rowData: { add_ons?: OrderDetailAddOn[] }) =>
            rowData.add_ons?.map((addOn, index) => (
            <Badge key={index} value={`${addOn.name} (${FormatNumber(addOn.price)})`} className="mr-2 mb-1" />
            ))
          }
        /> */}
        <Column
          field="status"
          header={__('order.status')}
          showFilterMenu={false}
          filter
          filterField="status"
          filterMatchMode="equals"
          style={{ minWidth: '12rem' }}
          filterElement={(options) => (
            <Dropdown
              value={options.value}
              options={orderDetailStatusOptions}
              onChange={(e) => options.filterApplyCallback?.(e.value)}
              placeholder={`${__('label.search_by')} ${__('order.status')}`}
              className="p-column-filter"
              showClear
            />
          )}
          body={(rowData) => {
            const status = rowData.status;
            let color = '';
            switch (status) {
                case 'DRAFT':
                  color = 'bg-gray-200 text-gray-800';
                  break;
                case 'PENDING':
                  color = 'bg-yellow-200 text-yellow-800';
                  break;                  
                case 'PROCESSING':
                  color = 'bg-green-200 text-green-800';
                  break;
                case 'FINISHED':
                  color = 'bg-blue-200 text-blue-800';
                  break; 
                default:
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
          header={__('order.image_name')}
          body={(rowData) =>
            rowData.order_media?.map((orderMedia: OrderDetailMedia, index: number) => (
              <Badge key={index} value={`${orderMedia.original_name}`} className="mr-2 text-white" />
            ))
          }
        /> 
        <Column
          header={__('label.actions')}
          body={(rowData, options) => (
            <div className="flex gap-2 flex-wrap"> 
            <Button
              icon="pi pi-pen-to-square"
              className="p-button-success p-button-sm"
              onClick={() => {
                const logs: OrderDetailLogWork[] =  rowData.order_log_works || [];

                const copiedAddOnslogs: OrderDetailLogWork[] = rowData.order_log_works.map((log: OrderDetailLogWork) => ({
                  id: log.id,
                  operator_id: log.operator_id,
                  printer_id: log.printer_id,
                  quantity: log.quantity,
                  start_work: log.start_work,
                  finish_work: log.finish_work,
                  print_status: log.print_status,
                  status: log.status,
                  remarks: log.remarks
                }));
                setEditingRowIndex(options.rowIndex - (workOrderDetails.current_page - 1) * workOrderDetails.per_page);  
                setDialogOrderDetailLogWork(copiedAddOnslogs);
                setLogWorkDialogVisible(true);                     
              }}
            />            
            <Button
              type="button"
              icon="pi pi-image"
              className="p-button-info p-button-sm"
              onClick={() => { 
                const media: OrderDetailMedia[] =  rowData.order_media || [];
                setSelectedMedia(media);
                setFileDialogVisible(true);
              }}
            />  
            </div> 
            )}
          />
        </DataTable>
      </div>
 
      <Dialog
        header={__('order.uploaded_files')} 
        visible={fileDialogVisible}
        style={{ width: '50vw' }}
        modal
        onHide={() => setFileDialogVisible(false)}
      >
        <div className="flex flex-wrap gap-3">
          {selectedMedia.map((media, idx) => {
            const isPDF = media.original_name.toLowerCase().endsWith('.pdf');
            return ( 
            <div key={idx} className="w-32 relative group">
            <span className="text-xs text-center mt-1 line-clamp-2">{media.original_name}</span>
              {isPDF ? (
                <div className="flex flex-col items-center justify-center h-32 border rounded bg-gray-100 p-2">
                  <i className="pi pi-file-pdf text-4xl text-red-500" />
                  <span className="text-xs text-center mt-1 line-clamp-2">{media.original_name}</span>
                </div>
              ) : (
                <img
                  src={`/storage/${media.name}`}
                  alt={media.original_name}
                  className="w-full h-32 object-cover border rounded"
                />
              )}
              <a
              href={route('orders.media-download', media.id)}
              className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
              {__('label.download')}
            </a>
            </div>
          )
          }
          )}
        </div>
      </Dialog>

      <Dialog
        header="Log Work"
        visible={logWorkDialogVisible}
        style={{ width: '90vw' }}
        onHide={() => setLogWorkDialogVisible(false)}
        modal
        footer={
            <div className="flex justify-end gap-2">
            <Button
              label={__('button.cancel')}
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => {
                setLogWorkDialogVisible(false);
              }}
            />
            <AuthButton
              permission='order-log-works.store' 
              label={__('button.save')}
              icon="pi pi-check"
              loading={loadingButton.action === 'save'}
              onClick={async () => {
              setLoadingButton({ action: 'save' });
              try {
                console.log(editingRowIndex);
                if (editingRowIndex != null) {
                  const fullData = {
                    order_detail_id: currWorkOrderDetails[editingRowIndex].id,
                    logs: dialogOrderDetailLogWork,
                  };

                  // Run frontend validation
                  const newErrors = ValidateField(fullData, rules, __);
                  if (Object.keys(newErrors).length > 0) {
                    setClientErrors(newErrors);
                    setTableKey((prev) => prev + 1);
                    return;
                  }
                  setClientErrors({});

                  // Attempt to save to server
                  const response = await axios.post(route('order-log-works.store'), fullData);
                  // Update local state 
                  // Replace only the matching item in currWorkOrderDetails
                  console.log(response.data);
                  setCurrWorkOrderDetails((prev) =>
                    prev.map((item) => {
                      const updated = response.data.order.order_details.find(
                        (updatedItem : OrderDetail) => updatedItem.id === item.id
                      );
                      return updated ? { ...item, status: updated.status, order_log_works: updated.order_log_works } : item;
                    })
                  );
                  setTableKey((prev) => prev + 1);
                  toast.current?.show({
                    severity: 'success', 
                    summary: 'Success',
                    detail: response.data.message, 
                  });
                  setLogWorkDialogVisible(false);
                }
              } catch (error: any) {
                console.error(error);

                // Handle Laravel validation errors
                if (error.response && error.response.status === 422) {
                  const serverErrors = error.response.data.errors;

                  const formattedErrors: Record<string, any> = {};
                  for (const field in serverErrors) {
                    if (serverErrors.hasOwnProperty(field)) {
                      SetDeepValue(formattedErrors, field, serverErrors[field][0]);
                    }
                  } 
                  setClientErrors(formattedErrors);
                  setTableLogWorkKey((prev) => prev + 1);  
                } else {
                  // Generic error
                  toast.current?.show({
                    severity: 'error', // or "info", "warn", "error"
                    summary: 'error',
                    detail: 'Failed', 
                  });
                }
              } finally {
                setLoadingButton({ action: null });
              }
            }}
            />
          </div>
        }
      >
        <div className="flex justify-between mb-4">  
          <Button
            label={__('button.add')}
            icon="pi pi-plus" 
            className="p-button-sm mt-2"
            onClick={() =>
              setDialogOrderDetailLogWork((prev) => [...prev, {  
                id: Date.now(),
                operator_id: null,
                printer_id: null,
                quantity: 0, 
                start_work: null, 
                finish_work: null,
                print_status: 'NORMAL',
                status: 'PENDING', 
                remarks: '' }])}
          />
        </div>
        <DataTable
          value={dialogOrderDetailLogWork}
          dataKey="id"
          key={tableLogWorkKey}
          editMode="row" 
        >
          <Column header="No" body={(_, options) => options.rowIndex + 1} style={{ width: '50px' }} />
          <Column
            field="printer_id"
            header={
              <>
                {__('orderLogWork.printer')}
                {IsRequired('logs.*.printer_id', rules) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </>
            }
            style={{ width: '200px' }}
            editor={(options) => (
              <Dropdown
                className="w-full"
                value={options.value}
                options={printerOptions} // Replace with your actual list
                optionLabel="name"
                optionValue="id"
                placeholder="--Select--"
                onChange={(e) => {
                  options.editorCallback?.(e.value);
                  updateOrderDetailLogWork(options.rowIndex, { printer_id: e.value });
                }}
              />
            )}
            body={(rowData) => {
              const printer = printerOptions.find((opt: any) => opt.id === rowData.printer_id);
              return printer?.name || '-';
            }}
          />
          <Column
            field="operator_id"
            header={
              <>
                {__('orderLogWork.operator')}
                {IsRequired('logs.*.operator_id', rules) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </>
            }
            style={{ width: '200px' }}
            editor={(options) => (
              <Dropdown
                className="w-full"
                value={options.value}
                options={operatorOptions}  
                optionLabel="name"
                optionValue="id"
                placeholder="--Select--"
                onChange={(e) => {
                  options.editorCallback?.(e.value);
                  updateOrderDetailLogWork(options.rowIndex, { operator_id: e.value });
                }}
              />
            )}
            body={(rowData) => {
              const operator = operatorOptions.find((opt: any) => opt.id === rowData.operator_id);
              return operator?.name || '-';
            }}
          />
          <Column
            field="quantity"
            header={
              <>
                {__('orderLogWork.quantity')}
                {IsRequired('logs.*.quantity', rules) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                 ({currWorkOrderDetails?.[editingRowIndex]?.quantity})
              </>
            }
            style={{ width: '100px' }}
            headerStyle={{ textAlign: 'center' }}
            bodyStyle={{ textAlign: 'right' }}
            editor={(options) => { 
              const print_status = options.rowData.print_status;
              const totalFinishedQuantity = dialogOrderDetailLogWork
                .filter((log: OrderDetailLogWork) => log.status === 'FINISHED' && log.print_status === print_status)
                .reduce((sum, log) => sum + Number(log.quantity), 0);
              const maxQuantity = editingRowIndex != null
                ? Number((currWorkOrderDetails[editingRowIndex]?.quantity - totalFinishedQuantity).toFixed(2))
                : Infinity;

              const errorMsg = (clientErrors?.logs as any)?.[options.rowIndex]?.quantity;
              return (
                <div className="flex flex-col gap-1">
                  <InputText
                    type="number"
                    min="0"
                    value={options.value}
                    onChange={(e) => {
                      let inputValue = Number(e.target.value);
                      console.log('inputValue1', inputValue);
                      if (inputValue > maxQuantity) {
                        inputValue = maxQuantity;
                      } 
                      options.editorCallback?.(inputValue);
                      updateOrderDetailLogWork(options.rowIndex, {
                        quantity: inputValue,
                      });
                    }}
                    className={`w-full ${errorMsg ? 'p-invalid' : ''}`}
                    style={{ minWidth: '80px' }}
                  /> 
                  {errorMsg && (
                    <small className="text-red-500">{errorMsg}</small>
                  )}
                </div>
              );
            }}
            body={(rowData, option) => {
              const errorMsg = (clientErrors?.logs as any)?.[option.rowIndex]?.quantity;
              return (
                <div className="flex flex-col gap-1 items-end">
                  <span>{rowData?.quantity || '-'}</span>
                  {errorMsg && (
                    <small className="text-red-500 text-xs">
                      {errorMsg}
                    </small>
                  )}
                </div>
              );
            }}
          /> 
          <Column
            field="start_work"
            header={
              <>
                {__('orderLogWork.start_work')}
                {IsRequired('logs.*.start_work', rules) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </>
            }
            style={{ width: '300px' }}
            editor={(options) => {
              const { start_work } = options.rowData;

              if (start_work) {
                // Just show the formatted date if already set
                const date = new Date(start_work);
                return (
                  <div className="p-2">
                    {date.toLocaleString('id-ID', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}
                  </div>
                );
              }

              // Otherwise, show the button
              return (
                <Button
                  type="button"
                  label={__('button.start_work')} // e.g., "Set Now"
                  icon="pi pi-clock"
                  className="w-full p-button-sm"
                  onClick={() => {
                    const now = new Date();
                    const isoDate = now.toISOString();
                    options.editorCallback?.(isoDate);
                    updateOrderDetailLogWork(options.rowIndex, {
                      start_work: isoDate,
                    });
                  }}
                />
              );
            }}
            body={(rowData) => {
              const { start_work } = rowData;

              if (!start_work) return '-';

              const date = new Date(start_work);
              return date.toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              });
            }}
          />
          <Column
            field="finish_work"
            header={
              <>
                {__('orderLogWork.finish_work')}
                {IsRequired('logs.*.finish_work', rules) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </>
            }
            style={{ width: '300px' }}
            editor={(options) => {
              const { finish_work } = options.rowData;
                    console.log(finish_work);
              if (finish_work) {
                // Just show the formatted date if already set
                const date = new Date(finish_work);
                return (
                  <div className="p-2">
                    {date.toLocaleString('id-ID', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}
                  </div>
                );
              }

              // Otherwise, show the button
              return (
                <Button
                  type="button"
                  label={__('button.finish_work')} // e.g., "Set Now"
                  icon="pi pi-clock"
                  className="w-full p-button-sm"
                  onClick={() => {
                    const now = new Date();
                    const isoDate = now.toISOString();
                    console.log(isoDate);
                    options.editorCallback?.(isoDate);
                    updateOrderDetailLogWork(options.rowIndex, {
                      finish_work: isoDate,
                    });
                  }}
                />
              );
            }}
            body={(rowData) => {
              const { finish_work } = rowData;

              if (!finish_work) return '-';

              const date = new Date(finish_work);
              return date.toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              });
            }}
          />

          <Column
            field="print_status"
            header={
              <>
                {__('orderLogWork.print_status')}
                {IsRequired('logs.*.print_status', rules) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </>
            }
            style={{ width: '200px' }}
            editor={(options) => (
              <Dropdown
                className="w-full"
                value={options.value}
                options={printStatusOptions}  
                optionLabel="label"
                optionValue="value"
                placeholder="--Select--"
                onChange={(e) => {
                  options.editorCallback?.(e.value);
                  updateOrderDetailLogWork(options.rowIndex, { print_status: e.value });
                }}
              />
            )}
            body={(rowData) => { 
              const printStatus = printStatusOptions.find((opt: any) => opt.label === rowData.print_status)?.label;
              return printStatus || '-'; 
            }}
          />          
          <Column field="status" header={__('order.status')} headerStyle={{ textAlign: 'left' }}/>           
          <Column
            field="remarks"
            header={
              <>
                {__('orderLogWork.remarks')}
                {IsRequired('logs.*.remarks', rules) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </>
            }
            style={{ width: '200px' }}
            editor={(options) => (
              <InputText
                value={options.value}
                onChange={(e) => {  
                  options.editorCallback?.(e.target.value);
                  updateOrderDetailLogWork(options.rowIndex, { remarks: e.target.value });
                }}
              
                className="w-full"
                style={{ minWidth: '180px' }} // prevents shifting
              />
            )}
          />
          <Column
            rowEditor
            header={__('button.edit')}
            bodyStyle={{ textAlign: 'center' }}
            style={{ width: '80px' }}
          />
          <Column
            header={__('label.actions')}
            style={{ width: '90px' }}
            body={(rowData, options) => (
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm"
                onClick={() => {
                  console.log('delete');
                  setDialogOrderDetailLogWork(dialogOrderDetailLogWork.filter((_, i) => i !== options.rowIndex));
                }}
                disabled={rowData.status=='FINISHED'}
              />
            )}
          />
        </DataTable>
      </Dialog>
    </AppLayout>
  );
};

export default WorkOrderIndexPage;
