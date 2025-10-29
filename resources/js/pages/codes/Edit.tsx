import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import {ValidateField, IsRequired} from '@/lib/RuleValidation';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext'; 
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast'; 
import { useLang } from '@/lib/lang'; 
import { SelectButton } from 'primereact/selectbutton';

type Props = {
  rules: any;  
  code: any;
}; 

const EditCodePage: React.FC<Props> = ({
  rules, code
}) => {
  const toast = useRef<Toast>(null);

  const { data, setData, put, processing } = useForm<{
    code_group: string;
    code: string;
    value1: string;
    value2: string | null; 
    order_no: number | null; 
    tag1: string | null; 
    tag2: string | null; 
    tag3: string | null; 
    is_active: number;
  }>({
    code_group: code.code_group,
    code: code.code,
    value1: code.value1, 
    value2: code.value2, 
    order_no: code.order_no, 
    tag1: code.tag1, 
    tag2: code.tag2, 
    tag3: code.tag3, 
    is_active: code.is_active
  });

  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 0 },
  ];


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
    { title: __('code.edit_code'), href: route('codes.index') },
  ];
 
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = ValidateField(data, rules, __);
    console.log(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      return;
    }
    setClientErrors({});
    put(route('codes.update', code.id), {
      preserveScroll: true, 
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('code.edit_code')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('code.edit_code')}</h2>

        <form onSubmit={handleSubmit}>           
          {/* code_group */}
          <div className="mb-4">
            <label className="block mb-1">{__('code.code_group')} {IsRequired('code_group', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.code_group ? 'p-invalid' : ''}`}
              value={data.code_group}
              onChange={(e) => setData('code_group', e.target.value)}
            />
            {clientErrors.code_group && <small className="text-red-500">{clientErrors.code_group}</small>}
          </div>
          {/* code */}
          <div className="mb-4">
            <label className="block mb-1">{__('code.code')} {IsRequired('code', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.code ? 'p-invalid' : ''}`}
              value={data.code}
              onChange={(e) => setData('code', e.target.value)}
            />
            {clientErrors.code && <small className="text-red-500">{clientErrors.code}</small>}
          </div>          
          {/* value1 */}
          <div className="mb-4">
            <label className="block mb-1">{__('code.value1')} {IsRequired('value1', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.value1 ? 'p-invalid' : ''}`}
              value={data.value1}
              onChange={(e) => setData('value1', e.target.value)}
            />
            {clientErrors.value1 && <small className="text-red-500">{clientErrors.value1}</small>}
          </div>
          {/* value2 */}
          <div className="mb-4">
            <label className="block mb-1">{__('code.value2')} {IsRequired('value2', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.value2 ? 'p-invalid' : ''}`}
              value={data.value2}
              onChange={(e) => setData('value2', e.target.value)}
            />
            {clientErrors.value2 && <small className="text-red-500">{clientErrors.value2}</small>}
          </div>
          {/* order_no */}
          <div className="mb-4">
            <label className="block mb-1">{__('code.order_no')} {IsRequired('order_no', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              type="number"
              className={`w-full ${clientErrors.order_no ? 'p-invalid' : ''}`}
              value={data.order_no !== null ? String(data.order_no) : ''}
              onChange={(e) => {
                const value = e.target.value;
                setData('order_no', value === '' ? null : Number(value));
              }}
            />
            {clientErrors.order_no && <small className="text-red-500">{clientErrors.order_no}</small>}
          </div>
          {/* tag1 */}
          <div className="mb-4">
            <label className="block mb-1">{__('code.tag1')} {IsRequired('tag1', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.tag1 ? 'p-invalid' : ''}`}
              value={data.tag1}
              onChange={(e) => setData('tag1', e.target.value)}
            />
            {clientErrors.tag1 && <small className="text-red-500">{clientErrors.tag1}</small>}
          </div>
          {/* tag2 */}
          <div className="mb-4">
            <label className="block mb-1">{__('code.tag2')} {IsRequired('tag1', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.tag2 ? 'p-invalid' : ''}`}
              value={data.tag2}
              onChange={(e) => setData('tag2', e.target.value)}
            />
            {clientErrors.tag2 && <small className="text-red-500">{clientErrors.tag2}</small>}
          </div>
          {/* tag3 */}
          <div className="mb-4">
            <label className="block mb-1">{__('code.tag3')} {IsRequired('tag3', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.tag2 ? 'p-invalid' : ''}`}
              value={data.tag3}
              onChange={(e) => setData('tag3', e.target.value)}
            />
            {clientErrors.tag3 && <small className="text-red-500">{clientErrors.tag3}</small>}
          </div>                   
          {/* is_active */}
          <div className="mb-4">
            <label className="block mb-1">{__('code.is_active')} {IsRequired('is_active', rules) && <span className="text-red-500">*</span>}</label>
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
          {/* Submit Buttons */}
          <div className="flex justify-end gap-2">
            <AuthButton
              permission='codes.index'
              type="button"
              label={__('button.cancel')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('codes.index'), {
                  onFinish: () => setIsNavigatingBack(false),
                });
              }}
              loading={isNavigatingBack}
            />
            <AuthButton
              permission='codes.update'
              type="submit" label={__('button.update')} loading={processing} />
          </div>
        </form>
      </div>

    </AppLayout>    
  );
};

export default EditCodePage;
