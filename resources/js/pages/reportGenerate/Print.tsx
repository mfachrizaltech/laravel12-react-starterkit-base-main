import 'primeicons/primeicons.css';  
import { useLang } from '@/lib/lang'; 
import { FormatNumber, FormatRupiah, FormatDate, FormatDateTime } from '@/lib/Formatter'; 
import React, { useEffect } from 'react';

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
  datasource: string 
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
  report: Report;
  records: any[];
  flash?: {
    success?: string;
    error?: string;
  }; 
  datasourceOptions: datasourceOption;
   input: Record<string, any>;
};

 
const ReportPrintPage: React.FC<Props> = ({ report, records, datasourceOptions, input }) => { 
  console.log(records); 
   
  const { __ } = useLang();  
     
  useEffect(() => {
    if (records.length > 0 || report.fields.length > 0) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000); // give more buffer
      return () => clearTimeout(timer);
    }
  }, [records, report]);

  const formatCell = (value: any, type: string) => {
    if (value == null) return '';
    switch (type) {
      case 'NUMBER':
        return new Intl.NumberFormat().format(value);
      case 'CURRENCY':
        return FormatRupiah(value);
      case 'DATE':
        return FormatDate(value);
      case 'DATETIME':
        return FormatDateTime(value);
      case 'STRING':
      default:
        return String(value);
    }
  };
 
  // Helper: display parameter value as text
  const renderParamValue = (param: ReportParameter) => {
    if (!param.field_code) return ''; // skip if null
      const val = input[param.field_code];

    if (!val) return '';
    if (param.parameter_type === 'NUMBER' || param.parameter_type === 'NUMBER') {
        return FormatNumber(val);
    }
    if (param.parameter_type === 'DATE') {
      return FormatDate(val);
    }
    if (param.parameter_type === 'DATETIME') {
      return FormatDateTime(val);
    }
    if (param.parameter_type === 'COMBOBOX' && param.datasource !== null) {
      const val = input[param.field_code];
      const option = datasourceOptions[param.datasource]?.find(
        (o) => String(o.value) === String(val)
      );
      return option ? option.label : val;
    }
    return String(val);
  };
 
 return (
    <div className="print-container p-4 text-black bg-white print:px-4 print:mx-4">
      {/* Print button hidden on paper */}
      <button
        onClick={() => window.print()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 print:hidden"
      >
        {__('button.print')}
      </button>

      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{report.name}</h2>
      </div>

      {/* Parameters */}
      <div className="mb-6">
        {report.parameters.map((param) => (
          <div key={param.field_code} className="mb-2">
            <span className="font-semibold">{param.label}: </span>
            <span>{renderParamValue(param)}</span>
          </div>
        ))}
      </div>

      {/* Records Table */}
      <table className="w-full border-collapse border text-sm print-table">
        <thead>
          <tr>
            {report.fields.map((field) => (
              <th key={field.field_code} className="border px-2 py-1 text-left">
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={report.fields.length} className="text-center py-2">
                {__('label.no_data_found')}
              </td>
            </tr>
          ) : (
            records.map((row, i) => (
              <tr key={i}>
                {report.fields.map((field) => (
                  <td key={field.field_code} className="border px-2 py-1">
                    {formatCell(row[field.field_code], field.data_type)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          html, body {
            background: #fff !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact;
          }
          .print-container {
            display: block !important;
            margin: 0 auto !important;   /* center the content */
            padding-left: 10mm !important;
            padding-right: 10mm !important;
          }
          .print-table th, .print-table td {
            border: 1px solid #000 !important;
          }
        }
      `}</style>
    </div>
  );
};
export default ReportPrintPage;
