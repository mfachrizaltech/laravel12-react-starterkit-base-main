import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import AppLayout from '@/layouts/app-layout';
import { useLang } from '@/lib/lang';
import { type BreadcrumbItem } from '@/types'; 
import { Head, usePage, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { DataTable, DataTableRowReorderEvent, DataTableExpandedRows } from 'primereact/datatable'; 
import { Column } from 'primereact/column'; 
import AuthButton from '@/components/customs/auth-button';
import { Toast } from 'primereact/toast';   
import { SelectButton } from 'primereact/selectbutton'; 
import { GetLucideIcon } from '@/lib/IconHelper'; 

type Menu = {
  id: number;
  parent_id: number | null;
  name: string;
  description: string | null;
  icon_id: string | null;
  url: string | null;
  order_number: number;
  is_active: number;
  children: Menu[];
}
 
type Props = {
  menus: Menu[];
  flash?: {
    success?: string;
    error?: string;
  }; 
};

const MenuIndexPage: React.FC<Props> = ({ menus }) => {
  const toast = useRef<Toast>(null); 
  const { filters: initialFilters = {} } = usePage().props as any;

  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

  const { __ } = useLang();

  const [currMenus, setCurrMenus] = useState(menus); 
  const [tableKey, setTableKey] = useState(0); 

  const [loadingButton, setLoadingButton] = useState<{
    id: number | null;
    action: string | null;
  }>({ id: null, action: null });
 
  const isActiveOptions = [
    { label: 'ON', value: 1 },
    { label: 'OFF', value: 0 },
  ];
 

  useEffect(() => {
    if (flash.success) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    }
    if (flash.error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }
  }, [flash]);
 
  const breadcrumbs: BreadcrumbItem[] = [
    { title: __('menu.menu'), href: route('menus.index') },
  ];
  
  const handleRowReorder = (e: DataTableRowReorderEvent<Menu[]>, parentId?: number) => {
    const reordered = e.value as Menu[];
    let payload: { id: number; order_number: number; parent_id?: number }[] = [];

    if (parentId) {
      // Reordering inside a child group
      setCurrMenus((prevMenus) =>
        prevMenus.map((menu) => {
          if (menu.id === parentId) {
            return {
              ...menu,
              children: reordered
            };
          }
          return menu;
        })
      );

      payload = reordered.map((child, index) => ({
        id: child.id,
        order_number: index + 1,
        parent_id: parentId
      }));

      console.log('Child reorder payload', payload);
    } else {
      // Reordering top-level menus
      setCurrMenus(reordered);

      payload = reordered.map((menu, index) => ({
        id: menu.id,
        order_number: index + 1
      }));
      console.log('Parent reorder payload', payload);
    } 
  };
 
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | null>(null);

  const rowExpansionTemplate = (data: Menu) => {
    return (
      <>
      <style>
        {`
        .custom-dt .p-datatable-thead,
        .custom-dt .p-datatable-tfoot,
        .custom-dt .p-datatable-footer {
          display: none !important;
        }

        .p-datatable-row-expansion > td {
          padding: 0 !important;
          border: none !important;
        }
      `}
      </style>
      <div className="p-3"> 
        <DataTable
            value={(data.children || []).map((child) => ({
              ...child,
              uniqueId: `child-${child.id}`
            }))}
            dataKey="uniqueId"
            
            className="custom-dt"
            showHeader={false}
            showfooter={false}
            reorderableRows
            onRowReorder={(e) => handleRowReorder(e, data.id)}      
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            tableStyle={{ minWidth: '50rem' }}
          >
          <Column expander style={{ width: '3rem' }} />
          <Column rowReorder style={{ width: '3rem' }} />
          <Column
            field="name"
            header={null}
            body={(rowData) => {
              const Icon = GetLucideIcon(rowData.icon_id);
              return (
                <div className="flex items-center font-medium">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="ml-2">{rowData.name}</span>
                </div>
              );
            }}
          />
          <Column field="description" header={null} />
          <Column field="url" header={null} />
          <Column
            header={null}
            body={(rowData) => {
              const status = rowData.is_active === 1 ? 'ON' : 'OFF';
              const color =
                status === 'ON' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
              return (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
                  {status}
                </span>
              );
            }}
          />
          <Column
            header={__('label.actions')}
            body={(rowData: Menu) => (
              <div className="flex gap-2 justify-center">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-sm"
                  onClick={() => {
                    setLoadingButton({ id: rowData.id, action: 'edit' });
                    setTableKey((prev) => prev + 1);
                    router.visit(route('menus.edit', rowData.id), {
                      onFinish: () => setLoadingButton({ id: null, action: null }),
                    });
                  }}
                  loading={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                  disabled={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                />  
              </div>
            )}
            style={{ width: '10rem', textAlign: 'center' }}
            headerStyle={{ textAlign: 'center' }}
          />
        </DataTable> 
      </div>
      </>

    );
  };
 

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('product.product')} />
      <Toast ref={toast} />

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{__('menu.menu')}</h2>
          <div className="flex justify-end gap-2 mt-4">
          <AuthButton
            permission='menus.reorder'
            label={__('button.save')} 
            onClick={() => {
              setLoadingButton({ id: null, action: 'save' });

              const buildPayload = (menus: Menu[], parentId: number | null = null): any[] => {
                return menus.flatMap((menu, index) => {
                  const base = {
                    id: menu.id,
                    order_number: index + 1,
                    parent_id: parentId
                  };

                  if (menu.children && menu.children.length > 0) {
                    return [base, ...buildPayload(menu.children, menu.id)];
                  }

                  return [base];
                });
              };

              const payload = buildPayload(currMenus);

              router.post(
                route('menus.reorder'), // or a dedicated save endpoint
                { menus: payload },
                {
                  preserveScroll: true, 
                  onFinish: () => setLoadingButton({ id: null, action: null }),
                }
              ); 
            }}
            loading={loadingButton.action === 'save'}
            disabled={loadingButton.action === 'save'}
          />
          <AuthButton
            permission='menus.create'
            label={__('button.add')}
            icon="pi pi-plus"
            onClick={() => { 
              setLoadingButton({ id: null, action: 'add' });
              router.visit(route('menus.create'), {
                onFinish: () => setLoadingButton({ id: null, action: null }),
              });
            }}
            loading={loadingButton.action === 'add'}
            disabled={loadingButton.action === 'add'}
          />
          </div>
        </div>

        <DataTable
          key={tableKey}
          value={currMenus}
          lazy
          dataKey="id" 
          tableStyle={{ minWidth: '60rem'}}
          rowClassName={() => 'hoverable-row'} 
          reorderableRows
          onRowReorder={(e) => handleRowReorder(e)}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
        >       
   
          <Column expander style={{ width: '3rem' }} /> 
          <Column rowReorder style={{ width: '3rem' }} />
          <Column header={__('menu.name')}  
            body={(rowData) => {
              const Icon = GetLucideIcon(rowData.icon_id);
              return (
                <div className="flex items-center font-medium">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="ml-2">{rowData.name}</span>
                </div>
              );
            }}
            bodyStyle={{ textAlign: 'left' }}   
            headerStyle={{ textAlign: 'center' }}
          />
          <Column header={__('menu.description')}  
            body={(rowData) => rowData.description}
            bodyStyle={{ textAlign: 'left' }}   
            headerStyle={{ textAlign: 'center' }}
          />
          <Column header={__('menu.url')}  
            body={(rowData) => rowData.url}
            bodyStyle={{ textAlign: 'left' }}   
            headerStyle={{ textAlign: 'center' }}
          />                  
          <Column
            field="is_active"
            header={__('product.is_active')}
            filter
            filterField="is_active"
            showFilterMenu={false}
            style={{ textAlign: 'center', minWidth: '12rem' }}
            filterElement={(options) => (
              <SelectButton
                value={options.value}
                onChange={(e) => options.filterApplyCallback(e.value)}
                options={isActiveOptions}
                optionLabel="label"
                optionValue="value"
                className="w-full"
              />
            )} 
              body={(rowData) => {
                const status = rowData.is_active===1 ? 'ON' : 'OFF';
                let color = '';
                switch (status) {
                  case 'ON':
                    color = 'bg-green-200 text-green-800';
                    break;
                  case 'OFF':
                    color = 'bg-red-200 text-red-800'; 
                }

                return (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
                  >
                    {status}
                  </span>
                );
              }}
          />        
          <Column
            header={__('label.actions')}
            body={(rowData: Menu) => (
              <div className="flex gap-2 justify-center">
                <AuthButton
                  permission='menus.edit'
                  icon="pi pi-pencil"
                  className="p-button-sm"
                  onClick={() => {
                    setLoadingButton({ id: rowData.id, action: 'edit' });
                    setTableKey((prev) => prev + 1);
                    router.visit(route('menus.edit', rowData.id), {
                      onFinish: () => setLoadingButton({ id: null, action: null }),
                    });
                  }}
                  loading={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                  disabled={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                />  
              </div>
            )}
            style={{ width: '10rem', textAlign: 'center' }}
            headerStyle={{ textAlign: 'center' }}
          />
          </DataTable> 
      </div>
 

    </AppLayout>
  );
};

export default MenuIndexPage;
