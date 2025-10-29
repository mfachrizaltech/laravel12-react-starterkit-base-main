import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import AppLayout from '@/layouts/app-layout';

import {ValidateField, IsRequired} from '@/lib/RuleValidation';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext'; 
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown'; 
import { useLang } from '@/lib/lang'; 
import { SelectButton } from 'primereact/selectbutton';

type Props = {
  rules: any; 
  permission: any;
  moduleOptions: any[];
};
  
const EditPermissionPage: React.FC<Props> = ({
  rules,
  permission,
  moduleOptions,
}) => {
  const toast = useRef<Toast>(null);
  const { data, setData, put, processing } = useForm({ 
    module: permission.module,
    name: permission.name, 
    description: permission.description,
    is_active: permission.is_active
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
    { title: __('permission.edit_permission'), href: route('permissions.index') },
  ];
 
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = ValidateField(data, rules, __);
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      return;
    }
    setClientErrors({});
    put(route('permissions.update', permission.id), {
      preserveScroll: true, 
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('permission.edit_permission')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('permission.edit_permission')}</h2>

        <form onSubmit={handleSubmit}>   

          {/* module */}
          <div className="mb-4">
            <label className="block mb-1">{__('permission.module')} {IsRequired('module', rules) && <span className="text-red-500">*</span>}</label>
            <Dropdown
              className={`w-full ${clientErrors.module ? 'p-invalid' : ''}`}
              value={data.module}
              options={moduleOptions}
              placeholder="--Select--"
              onChange={(e) => setData('module', e.value)}
            />
            {clientErrors.module && <small className="text-red-500">{clientErrors.module}</small>}
          </div>          
          {/* name */}
          <div className="mb-4">
            <label className="block mb-1">{__('permission.name')} {IsRequired('name', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.name ? 'p-invalid' : ''}`}
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {clientErrors.name && <small className="text-red-500">{clientErrors.name}</small>}
          </div>
           {/* label */}
          <div className="mb-4">
            <label className="block mb-1">{__('permission.description')} {IsRequired('description', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.description ? 'p-invalid' : ''}`}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            {clientErrors.description && <small className="text-red-500">{clientErrors.description}</small>}
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
              permission='permissions.index'
              type="button"
              label={__('button.cancel')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('permissions.index'), {
                  onFinish: () => setIsNavigatingBack(false),
                });
              }}
              loading={isNavigatingBack}
            />
            <AuthButton
              permission='permissions.update'
              type="submit" label={__('button.update')} loading={processing} />
          </div>
        </form>
      </div>

    </AppLayout>    
  );
};

export default EditPermissionPage;
