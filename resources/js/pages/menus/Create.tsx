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
import { AutoComplete } from 'primereact/autocomplete'; 
import axios from 'axios';
import * as LucideIcons from 'lucide-react';
import { GetLucideIcon } from '@/lib/IconHelper';

type Props = {
  rules: any;  
};

type Menu = {
  id: number | null;
  parent_id: number | null;
  name: string | null;
  description: string | null;
  icon_id: string | null;
  url: string | null;
  order_number: number | null;
  is_active: number | null;
}

const CreateMenuPage: React.FC<Props> = ({
  rules,   
}) => {
  const toast = useRef<Toast>(null);

  const { data, setData, post, processing } = useForm<{
    parent_id: number | null;
    name: string | null;
    description: string | null;
    icon_id: string | null;
    url: string | null; 
    is_active: number | null;
  }>({ 
    parent_id: null,
    name: null,
    description: null,
    icon_id: null,
    url: null, 
    is_active: 1,
  });
     

  const { errors } = usePage<{ errors: Record<string, string> }>().props;
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const page = usePage();
  const flash = (page.props as any)?.flash || {};
  const { __ } = useLang(); 
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);  
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
 
  const lucideIcons = Object.keys(LucideIcons)
    .filter((key) => /^[A-Z]/.test(key) && !key.endsWith('Icon'))
    .map((key) => ({
      label: key,
      value: key,
    })); 
 
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
    { title: __('menu.add_new_menu'), href: route('menus.index') },
  ];
 
  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 2 },
  ];

  const searchMenu = async (event: { query: string }) => {
    try {
      const response = await axios.get(route('menus.search'), {
        params: { query: event.query }
      });  
      setFilteredMenus(response.data.data);
    } catch (error) {
      console.error('Menu search failed:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = ValidateField(data, rules, __);
    if (Object.keys(newErrors).length > 0) {
      setClientErrors(newErrors);
      return;
    }
    setClientErrors({});
    post(route('menus.store'), {
      preserveScroll: true, 
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('menu.add_new_menu')} />
      <Toast ref={toast} />

      <div className="form-group">
        <h2 className="text-xl font-bold mb-4">{__('menu.add_new_menu')}</h2>

        <form onSubmit={handleSubmit}>   
          <div className="mb-4">
            <label className="block mb-1">{__('menu.parent')} {IsRequired('parent_id', rules) && <span className="text-red-500">*</span>}</label>
            <AutoComplete
              className="w-full"
              value={selectedMenu ?? undefined}
              suggestions={filteredMenus}
              completeMethod={searchMenu}
              field="name"
              onChange={(e) => {
                const selected = e.value;
                if (typeof selected === 'string') {
                  setSelectedMenu(selected);  
                  setData('parent_id', null);
                } else { 
                  setSelectedMenu(selected);
                  setData('parent_id', selected.id);
                }
              }}
              onBlur={() => {
                if (typeof selectedMenu === 'string') {
                  const match = filteredMenus.find(c => c.name === selectedMenu);
                  if (match) {
                    setSelectedMenu(match); 
                    setData('parent_id', match.id);
                  } else {
                    setSelectedMenu(null); 
                    setData('parent_id', null);
                  }
                }
              }}
              itemTemplate={(item: Menu) => (
                <div className="grid grid-cols-3 gap-2 px-2 py-1 border-b border-gray-200">
                  <span className="text-sm">{item.name}</span>
                </div>
              )}
            />
            {errors.parent_id && <small className="text-red-500">{errors.parent_id}</small>}
          </div>          
          {/* name */}
          <div className="mb-4">
            <label className="block mb-1">{__('menu.name')} {IsRequired('name', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.name ? 'p-invalid' : ''}`}
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {clientErrors.name && <small className="text-red-500">{clientErrors.name}</small>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">{__('menu.description')} {IsRequired('description', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.description ? 'p-invalid' : ''}`}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            {clientErrors.description && <small className="text-red-500">{clientErrors.description}</small>}
          </div>
          {/* icon_id */}
          <div className="mb-4">
            <label className="block mb-1">{__('menu.icon_id')} {IsRequired('icon_id', rules) && <span className="text-red-500">*</span>}</label>
            <Dropdown
              value={data.icon_id}
              options={lucideIcons}
              onChange={(e) => setData('icon_id', e.value)}
              optionLabel="label"
              virtualScrollerOptions={{ itemSize: 38 }} // estimate of item height
              itemTemplate={(option) => {
                const Icon = GetLucideIcon(option.value);
                return (
                <div className="flex items-center font-medium">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="ml-2">{option.label}</span>
                </div>
              );
              }}
              filter
              showClear
              placeholder="Select an icon"
            />
            {clientErrors.icon_id && <small className="text-red-500">{clientErrors.icon_id}</small>}
          </div>
          {/* url */}
          <div className="mb-4">
            <label className="block mb-1">{__('menu.url')} {IsRequired('url', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              className={`w-full ${clientErrors.url ? 'p-invalid' : ''}`}
              value={data.url}
              onChange={(e) => setData('url', e.target.value)}
            />
            {clientErrors.url && <small className="text-red-500">{clientErrors.url}</small>}
          </div>
          {/* order_number */}
          {/* <div className="mb-4">
            <label className="block mb-1">{__('menu.order_number')} {IsRequired('order_number', rules) && <span className="text-red-500">*</span>}</label>
            <InputText
              type="number"  
              step="1" 
              className={`w-full ${clientErrors.order_number ? 'p-invalid' : ''}`}
              value={data.order_number !== null ? data.order_number.toString() : ''}
              onChange={(e) => {
                const val = e.target.value;
                setData('order_number', val === '' ? null : parseInt(val));
              }}
            />
            {clientErrors.order_number && <small className="text-red-500">{clientErrors.order_number}</small>}
          </div>                    */}
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
              permission='menus.index'
              type="button"
              label={__('button.cancel')}
              className="p-button-secondary"
              onClick={() => {
                setIsNavigatingBack(true);
                router.visit(route('menus.index'), {
                  onFinish: () => setIsNavigatingBack(false),
                });
              }}
              loading={isNavigatingBack}
            />
            <AuthButton
              permission='menus.store'
              type="submit" label={__('button.save')} loading={processing} />
          </div>
        </form>
      </div>

    </AppLayout>    
  );
};

export default CreateMenuPage;
