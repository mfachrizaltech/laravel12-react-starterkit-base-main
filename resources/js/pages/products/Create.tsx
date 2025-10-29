import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import {ValidateField, IsRequired} from '@/lib/RuleValidation';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { SelectButton } from 'primereact/selectbutton';
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast';
import { useLang } from '@/lib/lang';  

type Props = {
  rules: any; 
};

const CreateProductPage: React.FC<Props> = ({ rules }) => {
  const toast = useRef<Toast>(null);
  const { __ } = useLang(); 

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
  const flash = (usePage().props as any)?.flash || {};
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  useEffect(() => setClientErrors(prev => ({ ...prev, ...errors })), [errors]);

  useEffect(() => {
    if (flash?.success) toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    if (flash?.error) toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
  }, [flash]);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('product.add_new_product'), href: route('products.index') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = ValidateField(data, rules, __);
    if (Object.keys(newErrors).length > 0) return setClientErrors(newErrors);
    post(route('products.store'), { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('product.add_new_product')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('product.add_new_product')}</h2>

        <form onSubmit={handleSubmit}>
                    <div className="mb-4">
            <label className="block mb-1">{ __('product.name') } {IsRequired('name', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.name ? 'p-invalid' : ''}`}
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {clientErrors.name && <small className="text-red-500">{clientErrors.name}</small>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">{ __('product.descriptions') } {IsRequired('descriptions', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.descriptions ? 'p-invalid' : ''}`}
              value={data.descriptions}
              onChange={(e) => setData('descriptions', e.target.value)}
            />
            {clientErrors.descriptions && <small className="text-red-500">{clientErrors.descriptions}</small>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">{ __('product.price') } {IsRequired('price', rules) && <span className="text-red-500">*</span>}</label>
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
          <div className="mb-4">
            <label className="block mb-1">{ __('product.is_active') } {IsRequired('is_active', rules) && <span className="text-red-500">*</span>}</label>
            <SelectButton
              className={`w-full ${clientErrors.is_active ? 'p-invalid' : ''}`}
              value={data.is_active}
              options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
              onChange={(e) => setData('is_active', e.value)}
            />
            {clientErrors.is_active && <small className="text-red-500">{clientErrors.is_active}</small>}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <AuthButton
              permission='products.index'
              type="button"
              label={__('button.cancel')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('products.index'), { onFinish: () => setIsNavigatingBack(false) });
              }}
              loading={isNavigatingBack}
            />
            <AuthButton
              permission='products.store'
              type="submit"
              label={__('button.save')}
              loading={processing}
            />
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateProductPage;