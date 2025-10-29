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
import { useLang } from '@/lib/lang'; 
import { SelectButton } from 'primereact/selectbutton';

type Props = { 
  product: any;
};
  
const ShowProductPage: React.FC<Props> = ({ 
  product,
}) => {
  const toast = useRef<Toast>(null);

  const { data, setData, put, processing } = useForm<{
    name: string | null; 
    descriptions: string | null; 
    price: number | null;
    is_active: number | null;
  }>({
    name: product.name, 
    descriptions: product.descriptions,
    price: product.price,
    is_active: product.is_active,
  });
     
 
  const page = usePage();
  const flash = (page.props as any)?.flash || {};
  const { __ } = useLang(); 
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('product.show_product'), href: route('products.index') },
  ];
 
  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 2 },
  ];
 
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('product.show_product')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('product.show_product')}</h2>
         
          {/* name */}
          <div className="mb-4">
            <label className="block mb-1">{__('product.name')}</label>
            <InputText
              className="w-full"
              readOnly
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            /> 
          </div>
          {/* description */}
          <div className="mb-4">
            <label className="block mb-1">{__('product.descriptions')} </label>
            <InputText
              className="w-full"
              readOnly 
              value={data.descriptions}
              onChange={(e) => setData('descriptions', e.target.value)}
            />
          </div>          
           {/* price */}
          <div className="mb-4">
            <label className="block mb-1">{__('product.price')}</label>
            <InputNumber
              className="w-full"
              readOnly
              value={data.price}
              onValueChange={(e) => setData('price', e.value ?? null)}
              mode="decimal"
              maxFractionDigits={0}
              useGrouping={false}
            />
          </div>
          {/* is_active */}
          <div className="mb-4">
            <label className="block mb-1">{__('product.is_active')}</label>
            <SelectButton
              className="w-full"
              disabled
              value={data.is_active}
              options={isActiveOptions}
              placeholder="--Select--"
              onChange={(e) => setData('is_active', e.value)}
            /> 
          </div>    
          <div className="flex justify-end gap-2">
            <AuthButton
              permission='products.index'
              type="button"
              label={__('button.back')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('products.index'), {
                  onFinish: () => setIsNavigatingBack(false),
                });
              }}
              loading={isNavigatingBack}
            /> 
          </div> 
      </div>

    </AppLayout>    
  );
};

export default ShowProductPage;