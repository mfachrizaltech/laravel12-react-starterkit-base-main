import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import {ValidateField, IsRequired} from '@/lib/RuleValidation';
import { useRef, useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast'; 
import { useLang } from '@/lib/lang';  
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton } from 'primereact/selectbutton';

type Props = {
  rules: any;
};

const CreateReportPage: React.FC<Props> = ({rules}) => {
  console.log(rules);
  const toast = useRef<Toast>(null); 
  const { data, setData, post, processing } = useForm<{ 
    name: string | null; 
    description: string | null; 
    query: string | null;  
    is_active: number;
  }>({ 
    name: null, 
    description: null, 
    query: null,  
    is_active: 1
  });

  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 2 },
  ];

  const { errors } = usePage().props as { errors: Record<string, string> };
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({}); 
  const { __ } = useLang();

  const [isNavigatingBack, setIsNavigatingBack] = useState(false); 
  useEffect(() => {
    setClientErrors(prev => ({ ...prev, ...errors }));
  }, [errors]);

  const page = usePage();
  const flash = (page.props as any)?.flash || {};

  useEffect(() => {
    if (flash?.success) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    }
    if (flash?.error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }
  }, [flash]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = ValidateField(data, rules, __);
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      return;
    }
    setClientErrors({});
    post(route('reports-maintenance.store'), {
      preserveScroll: true, 
    });
  };
 
  return ( 
    <AppLayout>
      <Head title={__('report.add_new_report')}/>
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('report.add_new_report')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">{__('report.name')} {IsRequired('name', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.name ? 'p-invalid' : ''}`}
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {clientErrors.name && <small className="text-red-500">{clientErrors.name}</small>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">{__('report.description')} {IsRequired('description', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.description ? 'p-invalid' : ''}`}
              value={data.description} 
              onChange={(e) => setData('description', e.target.value)}
            />
            {clientErrors.description && <small className="text-red-500">{clientErrors.description}</small>}
          </div>
          {/* Query */}
          <div className="mb-4">
            <label className="block mb-1">{__('report.query')} {IsRequired('query', rules) && <span className="text-red-500">*</span>}</label>
            <InputTextarea
              className={`w-full ${clientErrors.query ? 'p-invalid' : ''}`}
              value={data.query}
              onChange={(e) => setData('query', e.target.value)}
              rows={10}
              autoResize
            />
            {clientErrors.query && <small className="text-red-500">{clientErrors.query}</small>}
          </div>          
          {/* is_active */}
          <div className="mb-4">
            <label className="block mb-1">{__('product.is_active')} {IsRequired('is_active', rules) && <span className="text-red-500">*</span>}</label>
            <SelectButton
              className={`w-full ${clientErrors.is_active ? 'p-invalid' : ''}`}
              value={data.is_active}
              options={isActiveOptions}
              placeholder="--Select--"
              onChange={(e) => setData('is_active', e.value)}
            />
          {clientErrors.is_active && <small className="text-red-500">{clientErrors.is_active}</small>}
          </div>
          <div className="flex justify gap-2 font-bold">
            <span style={{ color: 'red' }}>* {__('label.required')} </span>
          </div>
          <div className="flex justify-end gap-2">
            <AuthButton
              permission='users.index'
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
              permission='reports-maintenance.store' 
              type="submit" label={__('button.save')} loading={processing} />
          </div>
        </form>
      </div>
    </AppLayout>    
  );
};

export default CreateReportPage;
