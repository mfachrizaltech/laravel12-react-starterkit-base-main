import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import {ValidateField, IsRequired} from '@/lib/RuleValidation';
import { useRef, useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { useLang } from '@/lib/lang'; 
import { Dropdown } from 'primereact/dropdown'; 

type Props = {
  user: any;
  roles: any[];
  rules: any;
  userRoles: any[];
};

const EditUserPage: React.FC<Props> = ({ user, roles, rules, userRoles }) => {
  const toast = useRef<Toast>(null);
  const { data, setData, put, processing } = useForm({
    name: user.name || '',
    email: user.email || '',
    roles: roles.find(r => r.id === userRoles?.[0]?.id) ?? null, // assuming single role
    password: '',
    confirm_password: '',
  });

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
    put(route('users.update', user.id), {
      preserveScroll: true, 
    });
  }; 
  
  return ( 
    <AppLayout>
      <Head title={__('profile.edit_user')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('profile.edit_user')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">{__('profile.name')} {IsRequired('name', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.name ? 'p-invalid' : ''}`}
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {clientErrors.name && <small className="text-red-500">{clientErrors.name}</small>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">{__('profile.email')} {IsRequired('email', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.email ? 'p-invalid' : ''}`}
              value={data.email}
              keyfilter="email"
              onChange={(e) => setData('email', e.target.value)}
            />
            {clientErrors.email && <small className="text-red-500">{clientErrors.email}</small>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">{__('profile.roles')} {IsRequired('roles', rules) && <span className="text-red-500">*</span>}</label>
            <Dropdown value={data.roles} onChange={(e) => setData('roles', e.value)} 
                options={roles} 
                optionLabel="label" 
                placeholder="Select" 
                className={`w-full md:w-14rem ${clientErrors.roles ? 'p-invalid' : ''}`}
             />
            {clientErrors.roles && <small className="text-red-500">{clientErrors.roles}</small>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">{__('profile.password')} {IsRequired('is_active', rules) && <span className="text-red-500">*</span>}</label>
            <Password
              className="w-full"
              value={data.password}
              onChange={(e) => {
                const value = e.target.value;
                setData('password', value);

                // Re-check confirm_password match if filled
                if (data.confirm_password && data.confirm_password !== value) {
                  setClientErrors((prev) => ({
                    ...prev,
                    confirm_password: 'Passwords do not match',
                  }));
                } else {
                  setClientErrors((prev) => {
                    const { confirm_password, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              toggleMask
            />
            {clientErrors.password && <small className="text-red-500">{clientErrors.password}</small>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">{__('profile.confirm_password')} {IsRequired('is_active', rules) && <span className="text-red-500">*</span>}</label>
            <Password
              className="w-full"
              value={data.confirm_password}
              onChange={(e) => {
                const value = e.target.value;
                setData('confirm_password', value);

                // Live validation
                if (value !== data.password) {
                  setClientErrors((prev) => ({
                    ...prev,
                    confirm_password: 'Passwords do not match',
                  }));
                } else {
                  setClientErrors((prev) => {
                    const { confirm_password, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              toggleMask
            />
            {clientErrors.confirm_password && <small className="text-red-500">{clientErrors.confirm_password}</small>}
          </div>
          <div className="flex justify-end gap-2">
            <AuthButton
              permission='users.index'
              label={__('button.cancel')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('users.index'), {
                  onFinish: () => setIsNavigatingBack(false),
                });
              }}
              loading={isNavigatingBack}
            />
            <AuthButton
              permission='users.update'
            type="submit" label={__('button.update')} loading={processing} />
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default EditUserPage;
