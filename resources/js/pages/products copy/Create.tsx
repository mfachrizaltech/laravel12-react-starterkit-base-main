import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import {ValidateField, IsRequired} from '@/lib/RuleValidation';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown'; 
import { useLang } from '@/lib/lang'; 
import { SelectButton } from 'primereact/selectbutton';

type Props = {
  rules: any; 
  printTypeOptions: any[];
};
  
const CreateProductPage: React.FC<Props> = ({
  rules,   
}) => {
  const toast = useRef<Toast>(null);

  const { data, setData, post, processing } = useForm<{
    name: string | null; 
    descriptions: string | null; 
    price: number | null;
    is_active: number | null;
  }>({
    name: '', 
    descriptions: '',
    price: 0,
    is_active: 1,
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
    { title: __('product.add_new_product'), href: route('products.index') },
  ];
 
  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 2 },
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
    post(route('products.store'), {
      preserveScroll: true, 
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('product.add_new_product')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('product.add_new_product')}</h2>

        <form onSubmit={handleSubmit}>         
          {/* name */}
          <div className="mb-4">
            <label className="block mb-1">{__('product.name')} {IsRequired('name', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.name ? 'p-invalid' : ''}`}
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {clientErrors.name && <small className="text-red-500">{clientErrors.name}</small>}
          </div>
          {/* description */}
          <div className="mb-4">
            <label className="block mb-1">{__('product.descriptions')} {IsRequired('descriptions', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.description ? 'p-invalid' : ''}`}
              value={data.descriptions}
              onChange={(e) => setData('descriptions', e.target.value)}
            />
            {clientErrors.description && <small className="text-red-500">{clientErrors.description}</small>}
          </div>          
           {/* price */}
          <div className="mb-4">
            <label className="block mb-1">{__('product.price')} {IsRequired('price', rules) && <span className="text-red-500">*</span>}</label>
            <InputNumber
              className={`w-full ${clientErrors.price ? 'p-invalid' : ''}`}
              value={data.price}
              onValueChange={(e) => setData('price', e.value ?? null)}
              mode="decimal"
              maxFractionDigits={0}
              useGrouping={false}
            />
            {clientErrors.price && <small className="text-red-500">{clientErrors.price}</small>}
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
          {/* Submit Buttons */}
          <div className="flex justify-end gap-2">
            <AuthButton
              permission='products.index'
              type="button"
              label={__('button.cancel')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('products.index'), {
                  onFinish: () => setIsNavigatingBack(false),
                });
              }}
              loading={isNavigatingBack}
            />
            <AuthButton
              permission='products.store'
              type="submit" label={__('button.save')} loading={processing} />
          </div>
        </form>
      </div>

    </AppLayout>    
  );
};

export default CreateProductPage;
