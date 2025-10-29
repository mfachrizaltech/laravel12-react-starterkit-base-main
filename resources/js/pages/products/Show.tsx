import 'primeicons/primeicons.css';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { SelectButton } from 'primereact/selectbutton';
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast';
import { useLang } from '@/lib/lang';

type Props = { product: any; };

const ShowProductPage: React.FC<Props> = ({ product }) => {
  const toast = useRef<Toast>(null);
  const { __ } = useLang();
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const { data } = useForm<any>({ ...product });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('product.show_product'), href: route('products.index') },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('product.show_product')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('product.show_product')}</h2>

                <div className="mb-4">
            <label className="block mb-1">{ __('product.name') }</label>
            <InputText
            className="w-full"
            value={data.name}
            readOnly 
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">{ __('product.descriptions') }</label>
            <InputText
            className="w-full"
            value={data.descriptions}
            readOnly 
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">{ __('product.price') }</label>
            <InputNumber
            className="w-full"
            value={data.price}
            mode="decimal"
            maxFractionDigits={0}
            useGrouping={false}
            readOnly 
            />
        </div>
        <div className="mb-4">
            <label className="block mb-1">{ __('product.is_active') }</label>
            <SelectButton
            className="w-full"
            value={data.is_active}
            options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
            disabled
            />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <AuthButton
            permission='products.index'
            type="button"
            label={__('button.back')}
            className="p-button-secondary"
            onClick={() => {
              setIsNavigatingBack(true);
              router.visit(route('products.index'), { onFinish: () => setIsNavigatingBack(false) });
            }}
            loading={isNavigatingBack}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default ShowProductPage;