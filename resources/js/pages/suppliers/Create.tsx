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

type Props = {
  rules: any;  
}; 

const CreateSupplierPage: React.FC<Props> = ({
  rules,   
}) => {
  const toast = useRef<Toast>(null);
 
  const { data, setData, post, processing } = useForm<{
    name: string;
    address1: string | null; 
    address2: string | null; 
    address3: string | null; 
    city: string | null; 
    country: string | null; 
    phone: string | null; 
  }>({
    name: '',
    address1: null,
    address2: null,
    address3: null,
    city: null,
    country: null,
    phone: null,
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
    { title: __('supplier.add_new_supplier'), href: route('suppliers.index') },
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
    post(route('suppliers.store'), {
      preserveScroll: true, 
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('supplier.add_new_supplier')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('supplier.add_new_supplier')}</h2>
        <form onSubmit={handleSubmit}>
          {/* name */}
          <div className="mb-4">
            <label className="block mb-1">{__('supplier.name')} {IsRequired('name', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.code ? 'p-invalid' : ''}`}
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {clientErrors.name && <small className="text-red-500">{clientErrors.name}</small>}
          </div>          
          {/* address1 */}
          <div className="mb-4">
            <label className="block mb-1">{__('supplier.address1')} {IsRequired('address1', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.address1 ? 'p-invalid' : ''}`}
              value={data.address1}
              onChange={(e) => setData('address1', e.target.value)}
            />
            {clientErrors.address1 && <small className="text-red-500">{clientErrors.address1}</small>}
          </div>
          {/* address2 */}
          <div className="mb-4">
            <label className="block mb-1">{__('supplier.address2')} {IsRequired('address2', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.value2 ? 'p-invalid' : ''}`}
              value={data.address2}
              onChange={(e) => setData('address2', e.target.value)}
            />
            {clientErrors.address2 && <small className="text-red-500">{clientErrors.address2}</small>}
          </div>
          {/* address3 */}
          <div className="mb-4">
            <label className="block mb-1">{__('supplier.address3')} {IsRequired('address3', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.address3 ? 'p-invalid' : ''}`}
              value={data.address3}
              onChange={(e) => setData('address3', e.target.value)}
            />
            {clientErrors.address3 && <small className="text-red-500">{clientErrors.address3}</small>}
          </div>
          {/* city */}
          <div className="mb-4">
            <label className="block mb-1">{__('supplier.city')} {IsRequired('city', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.city ? 'p-invalid' : ''}`}
              value={data.city}
              onChange={(e) => setData('city', e.target.value)}
            />
            {clientErrors.city && <small className="text-red-500">{clientErrors.city}</small>}
          </div>                      
          {/* country */}
          <div className="mb-4">
            <label className="block mb-1">{__('supplier.country')} {IsRequired('country', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.country ? 'p-invalid' : ''}`}
              value={data.country}
              onChange={(e) => setData('country', e.target.value)}
            />
            {clientErrors.country && <small className="text-red-500">{clientErrors.country}</small>}
          </div>                      
          {/* phone */}
          <div className="mb-4">
            <label className="block mb-1">{__('supplier.phone')} {IsRequired('phone', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.phone ? 'p-invalid' : ''}`}
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
            />
            {clientErrors.phone && <small className="text-red-500">{clientErrors.phone}</small>}
          </div>                      

          <div className="flex justify gap-2 font-bold">
            <span style={{ color: 'red' }}>* {__('label.required')} </span>
          </div>                
          {/* Submit Buttons */}
          <div className="flex justify-end gap-2">
            <AuthButton
              permission='suppliers.index'
              type="button"
              label={__('button.cancel')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('suppliers.index'), {
                  onFinish: () => setIsNavigatingBack(false),
                });
              }}
              loading={isNavigatingBack}
            />
            <AuthButton
              permission='suppliers.store'
              type="submit" label={__('button.save')} loading={processing} />
          </div>
        </form>
      </div>

    </AppLayout>    
  );
};

export default CreateSupplierPage;
