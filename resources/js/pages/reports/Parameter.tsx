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
  reportParameters: ReportParameter[];
  parameterTypeOptions: any; 
  datasourceOptions: any; 
};
 
type ReportParameter = {
  id: number | null, 
  report_id : number | null, 
  label: string | null,  
  field_code: string | null,  
  parameter_type: string | null,  
  datasource: number | null 
}; 

            
const EditParameterReportPage: React.FC<Props> = ({
  rules, 
  reportId,
  reportParameters, 
  parameterTypeOptions,
  datasourceOptions,

}) => {
  const toast = useRef<Toast>(null);
 
  const { data, setData, post, processing } = useForm<{ 
      report_parameters: ReportParameter[],  
    }>({     
    report_parameters: []
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
    { title: __('report.update_field'), href: route('reports-maintenance.index') },
  ];

  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const [records, setRecords]  = useState<ReportParameter[]>(reportParameters);
     
  const updateRecord = (
    index: number,
    updates: Partial<ReportParameter>
  ) => {
    setRecords((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };   

  useEffect(() => {
    if (shouldSubmit) { 
      const id = reportId;
      post(route('reports-maintenance.parameter.update', id), {
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
      report_parameters : records,
    }; 
    const newErrors = ValidateField(fullData, rules, __); 
    console.log(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      setTableKey((prev) => prev + 1);
      return;
    }
    setClientErrors({});
    setData('report_parameters', records);    
    setShouldSubmit(true); 
  };  
 
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('report.update_parameter')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('report.update_parameter')}</h2>

        <form onSubmit={handleSubmit}> 
          <div className="my-4">
            <div className="flex justify-between mb-4">
            </div>
            <DataTable value={records} 
                dataKey="id" 
                key={tableKey} 
            >
                <Column header="No" body={(_, options) => options.rowIndex + 1} style={{ width: '50px' }} />
                <Column
                    header={
                    <>
                        {__('report.label')}
                        {IsRequired('report_paremeters.*.label', rules) && (
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
                        {IsRequired('report_parameters.*.field_code', rules) && (
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
                        {__('report.parameter_type')}
                        {IsRequired('report_parameters.*.parameter_type', rules) && (
                        <span className="text-red-500 ml-1">*</span>
                        )}
                    </>
                    }
                    body={(rowData, options) => {
                    const rowIndex = options.rowIndex;
                    const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.parameter_type;
                    return (
                        <div className="flex flex-col gap-1">
                        <Dropdown
                            value={rowData.parameter_type}
                            options={parameterTypeOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="--Select--"
                            onChange={(e) => {
                                updateRecord(options.rowIndex, { parameter_type: e.value });
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
                        {__('report.datasource')}
                        {IsRequired('report_fields.*.datasource', rules) && (
                        <span className="text-red-500 ml-1">*</span>
                        )}
                    </>
                    }
                    body={(rowData, options) => {
                    const rowIndex = options.rowIndex;
                    const errorMsg = (clientErrors.item_details as any)?.[rowIndex]?.datasource;
                    return (
                        <div className="flex flex-col gap-1">
                        <Dropdown
                            value={rowData.datasource}
                            options={datasourceOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="--Select--"
                            onChange={(e) => {
                                updateRecord(options.rowIndex, { datasource: e.value });
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
              permission='reports-maintenance.parameter.update'
              type="submit" label={__('button.save')} loading={processing} />
          </div>
        </form>
      </div>
      
    </AppLayout>
  );
};

export default EditParameterReportPage;