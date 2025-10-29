import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import {ValidateField, IsRequired} from '@/lib/RuleValidation'; 
import { type BreadcrumbItem } from '@/types';
import { useRef, useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext'; 
import AuthButton from '@/components/customs/auth-button'; 
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown'; 
import { SelectButton } from 'primereact/selectbutton';
import { useLang } from '@/lib/lang'; 
import { DataTable, DataTableRowReorderEvent, DataTableExpandedRows } from 'primereact/datatable'; 

import { Column } from 'primereact/column';

type Props = {
  rules: any; 
  reportId: string;
  reportFields: ReportField[];
  dataTyeOptions: any; 
  reportOptions: any;
  alignOptions: any;
};

type ReportField = {
  id: number | null, 
  report_id : number | null, 
  label: string | null,  
  field_code: string | null,  
  data_type: string | null,  
  hidden: number | null,  
  link_form_id: string | null,  
  link_param: string | null,  
  align: string | null,  
  order_no: string | null,   
}; 

            
const EditFieldReportPage: React.FC<Props> = ({
  rules, 
  reportId,
  reportFields,
  dataTyeOptions, 
  reportOptions,
  alignOptions, 

}) => {
  const toast = useRef<Toast>(null);
 
  const { data, setData, post, processing } = useForm<{ 
      report_fields: ReportField[],  
    }>({     
    report_fields: []
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

  console.log(clientErrors);

  const isOptions = [
    { label: 'YES', value: 1 },
    { label: 'NO', value: 0 },
  ];

  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('report.update_field'), href: route('reports-maintenance.index') },
  ];

  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const [records, setRecords]  = useState<ReportField[]>(reportFields);
    
  const handleRowReorder = (e: DataTableRowReorderEvent<ReportField[]>) => {
  const reordered = e.value as ReportField[];

  // Update state with new order_no values
    setRecords(
        reordered.map((record, index) => ({
        ...record,
        order_no: String(index + 1), // keep as string since your type defines it that way
        }))
    );  
  };

  const updateRecord = (
    index: number,
    updates: Partial<ReportField>
  ) => {
    setRecords((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };   

  useEffect(() => {
    if (shouldSubmit) { 
      const id = reportId;
      post(route('reports-maintenance.field.update', id), {
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
      report_fields : records,
    }; 
    const newErrors = ValidateField(fullData, rules, __); 
    console.log(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      setTableKey((prev) => prev + 1);
      return;
    }
    setClientErrors({});
    setData('report_fields', records);    
    setShouldSubmit(true); 
  };  
 
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('report.update_field')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('report.update_field')}</h2>

        <form onSubmit={handleSubmit}> 
          <div className="my-4">
            <div className="flex justify-between mb-4">
            </div>
            <DataTable value={records} 
                dataKey="id" 
                key={tableKey}
                reorderableRows
                onRowReorder={(e) => handleRowReorder(e)}  
            >
                <Column header="No" body={(_, options) => options.rowIndex + 1} style={{ width: '50px' }} />
                <Column rowReorder style={{ width: '3rem' }} />
                <Column
                    header={
                    <>
                        {__('report.label')}
                        {IsRequired('report_fields.*.label', rules) && (
                        <span className="text-red-500 ml-1">*</span>
                        )}
                    </>
                    }
                    body={(rowData, options) => {
                    const rowIndex = options.rowIndex;
                    const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.label;    
                    return (
                    <div className="flex flex-col">  
                        <InputText 
                        value={rowData.label}
                        onChange={(e) =>
                            updateRecord(options.rowIndex, { label: e.target.value }) 
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
                    header={
                    <>
                        {__('report.field_code')}
                        {IsRequired('report_fields.*.field_code', rules) && (
                        <span className="text-red-500 ml-1">*</span>
                        )}
                    </>
                    }
                    body={(rowData, options) => {
                    const rowIndex = options.rowIndex;
                    const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.field_code;    
                    return (
                    <div className="flex flex-col">  
                        {rowData.field_code}
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
                        {__('report.data_type')}
                        {IsRequired('report_fields.*.data_type', rules) && (
                        <span className="text-red-500 ml-1">*</span>
                        )}
                    </>
                    }
                    body={(rowData, options) => {
                    const rowIndex = options.rowIndex;
                    const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.data_type;
                    return (
                        <div className="flex flex-col gap-1">
                        <Dropdown
                            value={rowData.data_type}
                            options={dataTyeOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="--Select--"
                            onChange={(e) => {
                                updateRecord(options.rowIndex, { data_type: e.value });
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
                        {__('report.hidden')}
                        {IsRequired('report_fields.*.hidden', rules) && (
                        <span className="text-red-500 ml-1">*</span>
                        )}
                    </>
                    }
                    body={(rowData, options) => {
                    const rowIndex = options.rowIndex;
                    const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.hidden;
                    return (
                        <div className="flex flex-col gap-1">
                        <SelectButton
                            value={rowData.hidden}
                            options={isOptions} 
                            placeholder="--Select--"
                            onChange={(e) => {
                                updateRecord(options.rowIndex, { hidden: e.value });
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
                        {__('report.link_form_id')}
                        {IsRequired('report_fields.*.link_form_id', rules) && (
                        <span className="text-red-500 ml-1">*</span>
                        )}
                    </>
                    }
                    body={(rowData, options) => {
                    const rowIndex = options.rowIndex;
                    const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.link_form_id;
                    return (
                        <div className="flex flex-col gap-1">
                        <Dropdown
                            value={Number(rowData.link_form_id)}
                            options={reportOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="--Select--"
                            onChange={(e) => {
                                console.log(rowData.link_form_id);
                                console.log(reportOptions);
                                updateRecord(options.rowIndex, { link_form_id: e.value });
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
                        {__('report.align')}
                        {IsRequired('report_fields.*.align', rules) && (
                        <span className="text-red-500 ml-1">*</span>
                        )}
                    </>
                    }
                    body={(rowData, options) => {
                    const rowIndex = options.rowIndex;
                    const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.align;
                    return (
                        <div className="flex flex-col gap-1">
                        <Dropdown
                            value={rowData.align}
                            options={alignOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="--Select--"
                            onChange={(e) => {
                                updateRecord(options.rowIndex, { align: e.value });
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
            </DataTable> 
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2"> 
            <AuthButton
              permission='reports-maintenance.index'
              type="button"
              label={__('button.cancel')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('reports-maintenance.index'), {
                  onFinish: () => setIsNavigatingBack(false),
                });
              }}
              loading={isNavigatingBack}
            />
            <AuthButton 
              permission='reports-maintenance.field.update'
              type="submit" label={__('button.save')} loading={processing} />
          </div>
        </form>
      </div>
      
    </AppLayout>
  );
};

export default EditFieldReportPage;
