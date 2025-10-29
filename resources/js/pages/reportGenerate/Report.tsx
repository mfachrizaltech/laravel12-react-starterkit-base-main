import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import { useLang } from '@/lib/lang';
import { type BreadcrumbItem } from '@/types'; 
import { Head, useForm, usePage, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from '@inertiajs/react';
import { Toast } from 'primereact/toast';  
import { FilterMatchMode } from 'primereact/api';   
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar'; 
import {ValidateField, IsRequired} from '@/lib/RuleValidation';
import AuthButton from '@/components/customs/auth-button';
import { FormatDateDB, FormatDateTimeDB, FormatRupiah, FormatDate, FormatDateTime } from '@/lib/Formatter'; 

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

type ReportParameter = {
  id: number | null, 
  report_id : number | null, 
  label: string | null,  
  field_code: string | null,  
  parameter_type: string | null,  
  datasource: string | null 
}; 

type Report = {
  id: number;
  name: string;
  description: string;
  query: string; 
  is_active: number;
  parameters: ReportParameter[];
  fields: ReportField[];
}; 

// Each option item
type Option = {
  label: string;
  value: number;
};
 
// Response with dynamic keys
type datasourceOption = {
  [key: string]: Option[];
};

type Props = {
  rules: any;
  report: Report;
  records: {
    data: any[];
    current_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  }; 
  datasourceOptions: datasourceOption;
  
};

const ReportGeneratePage: React.FC<Props> = ({ rules, report, records, datasourceOptions }) => { 
  
  console.log(records);
  const toast = useRef<Toast>(null); 
  const { filters: initialFilters = {} } = usePage().props as any;

  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

  const { __ } = useLang(); 
  const [loadingButton, setLoadingButton] = useState<{ 
    action: string | null;
  }>({ action: null });
 
  const [currRecords, setCurrRecords] = useState(records.data); 
  useEffect(() => {
    setCurrRecords(records.data);
  }, [records]);
       
  
  const [filters, setFilters] = useState(null);  
  
  const { data: formData, setData, get, processing } = useForm<Record<string, any>>({});
 
  const onFilterChange = (e: any) => { 
    setFilters(e.filters);  
    // Send filters to Laravel
    router.get(route('reports-generate.generate', report.id), {
      ...formData,   // include current form values
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
    router.get(route('reports-generate.generate', report.id), { page, search: filters }, { preserveScroll: true, preserveState: true });
  };
   
  const formatCell = (value: any, type: string) => {
    if (value == null) return '';

    switch (type) {
      case 'NUMBER':
        return new Intl.NumberFormat().format(value);

      case 'CURRENCY':
        return FormatRupiah(value);

      case 'DATE':
        return FormatDate(value); // YYYY-MM-DD

      case 'DATETIME':
        return FormatDateTime(value); // local format

      case 'STRING':
      default:
        return String(value);
    }
  };

  const { errors } = usePage<{ errors: Record<string, string> }>().props;
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({}); 
  useEffect(() => {
    setClientErrors(prev => ({ ...prev, ...errors }));
  }, [errors]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    const newErrors = ValidateField(formData, rules, __);
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      return;
    }
    setClientErrors({});
    get(route('reports-generate.generate', report.id), {
      preserveScroll: true, 
      preserveState: true,
    });
  };


  return ( 
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('report.reports')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{report.name}</h2> 
        </div> 

        <form onSubmit={handleSubmit}>
        {report.parameters.map((param: any) => (
          <div key={param.field_code} className="mb-4">
            {/* Label with required star */}
            <label className="block mb-1">
              {param.label}
              {IsRequired(param.field_code, rules) && (
                <span className="text-red-500"> *</span>
              )}
            </label>

              {/* Input type depends on parameter_type */}
              {param.parameter_type === 'STRING' && (
                <InputText
                  name={param.field_code}
                  value={formData[param.field_code] ?? ''}
                  onChange={(e) =>
                    setData((prev: any) => ({
                      ...prev,
                      [param.field_code]: e.target.value,
                    }))
                  }
                  className={`w-full ${clientErrors[param.field_code] ? 'p-invalid' : ''}`}
                />
              )}

              {(param.parameter_type === 'NUMBER' || param.parameter_type === 'CURRENCY') && (
                <InputNumber
                  name={param.field_code}
                  value={formData[param.field_code] ?? null}
                  onChange={(e) =>
                    setData((prev: any) => ({
                      ...prev,
                      [param.field_code]: e.value,
                    }))
                  }
                  className={`w-full ${clientErrors[param.field_code] ? 'p-invalid' : ''}`}
                />
              )}
              {param.parameter_type === 'DATE' && (
                <Calendar
                  name={param.field_code}
                  value={formData[param.field_code] ? new Date(formData[param.field_code]) : null}
                  onChange={(e) =>
                    setData((prev: any) => ({
                      ...prev,
                      [param.field_code]: FormatDateDB(e.value),
                    }))
                  }
                  dateFormat="dd-mm-yy"
                  className={`w-full ${clientErrors[param.field_code] ? 'p-invalid' : ''}`}
                  placeholder={`Select ${param.label}`}
                />
              )}
              {param.parameter_type === 'DATETIME' && (
                <Calendar
                  name={param.field_code}
                  value={formData[param.field_code] ? new Date(formData[param.field_code]) : null}
                  onChange={(e) => {
                    console.log(FormatDateTimeDB(e.value));
                    setData((prev: any) => ({
                      ...prev,
                      [param.field_code]: FormatDateTimeDB(e.value),
                    }))
                  }

                  }
                  className={`w-full ${clientErrors[param.field_code] ? 'p-invalid' : ''}`}
                  placeholder={`Select ${param.label}`}
                  showTime
                  showSeconds
                  dateFormat="dd-mm-yy"
                  hourFormat="24"
                />
              )}               
              {param.parameter_type === 'COMBOBOX' && (
                <Dropdown
                  name={param.field_code}
                  options={datasourceOptions[param.datasource]} 
                  value={formData[param.field_code] ?? null} 
                  onChange={(e) =>
                    setData((prev: any) => ({
                      ...prev,
                      [param.field_code]: e.value,
                    }))
                  }
                  className={`w-full ${clientErrors[param.field_code] ? 'p-invalid' : ''}`}
                />
              )}
              {/* Show error */}
              {clientErrors[param.field_code] && (
                <small className="text-red-500">
                  {clientErrors[param.field_code]}
                </small>
              )}
            </div>
          ))}
          {/* Submit Buttons */}
          <div className="flex justify gap-2 my-4">
            <AuthButton
              permission='permissions.store' 
              type="submit" label={__('button.generate')} loading={processing} /> 
            <AuthButton
              permission="reports-generate.index"
              type="button"
              label={__('button.back')}  
              className="p-button-secondary"
              onClick={() => { 
                setLoadingButton({ action: 'back' });
                router.visit(route('reports-generate.index'), {
                  onFinish: () => setLoadingButton({ action: null }),
                });
              }}
              loading={loadingButton.action === 'back'}
              disabled={loadingButton.action === 'back'}
            />
          </div>
        </form>  

      <div>

      <div className="flex justify-end gap-2 my-4"> 
        <AuthButton
          permission='reports-generate.download'
          type="button"
          label={__('button.export_excel')}
          icon="pi pi-file-excel"
          className="p-button-success"
          onClick={() => {
            console.log(formData);
            window.location.href = route('reports-generate.download', report.id) + 
              '?' + new URLSearchParams(formData).toString();
          }}
          loading={loadingButton.action === 'export'}
          disabled={loadingButton.action === 'export'}
        /> 
        <AuthButton
            permission="reports-generate.print"
            type="button"
            label={__('button.print')}
            icon="pi pi-print"
            className="p-button-secondary"
          onClick={() => {
            setLoadingButton({ action: 'print' }); 
            const printWindow = window.open(
                route('reports-generate.print', report.id) + '?' + new URLSearchParams(formData).toString(),
                '_blank'
              );

            if (printWindow) {
              const timer = setInterval(() => {
                if (printWindow.closed) {
                  clearInterval(timer);
                  setLoadingButton({action: null });
                }
              }, 500); // check every 0.5 seconds
            } else {
              // Fallback if popup blocked
              setTimeout(() => setLoadingButton({action: null }), 2000);
            }
          }}
          loading={loadingButton.action === 'print'}
          disabled={loadingButton.action === 'print'}
        />                          
      </div>
        <DataTable
          value={currRecords}
          paginator
          rows={records.per_page}
          totalRecords={records.total}
          first={(records.current_page - 1) * records.per_page}
          onPage={onPage}
          lazy
          dataKey="id"
          // filters={filters}
          // onFilter={onFilterChange}
          // filterDisplay="row"
          // globalFilterFields={report.fields.map((f: any) => f.field_code)}
          emptyMessage={__('label.no_data_found')}
          tableStyle={{ minWidth: '60rem' }}
          rowClassName={() => 'hoverable-row'}
        >
          {report.fields.map((field: any) => (
            <Column
              key={field.field_code}
              field={field.field_code}
              header={field.label}
              // filter
              // filterPlaceholder={`${__('label.search_by')} ${field.label}`}
              style={{ minWidth: '10rem' }}
              //todo create link to other form 
              // if link_form_id != null
              // 					$paramurl = '';
              //foreach ($report->fields as $f) { 
              //		$paramurl .= $f->field_code .'='. $res[$f->field_code] . '&';
              //		}
              // link -> route('reports-generate.generate', rowData.link_form_id, $paramurl
              body={(rowData) => {
                if (field.link_form_id) {
                  const queryParams = new URLSearchParams(
                    report.fields.reduce((acc: any, f: any) => {
                      acc[f.field_code] = rowData[f.field_code];
                      return acc;
                    }, {})
                  ).toString();

                  return (
                    <Link
                      href={route('reports-generate.generate', [field.link_form_id]) + '?' + queryParams}
                      className="text-blue-500 underline"
                    >
                      {formatCell(rowData[field.field_code], field.data_type)}
                    </Link>
                  );
                }
                return formatCell(rowData[field.field_code], field.data_type);
              }}
            />
        ))}
        </DataTable>
      </div>  
    </div>    
    </AppLayout> 
  );
};

export default ReportGeneratePage;
