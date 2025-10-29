import 'primeicons/primeicons.css'; 
import AppLayout from '@/layouts/app-layout';
import { useLang } from '@/lib/lang';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AuthButton from '@/components/customs/auth-button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Badge } from 'primereact/badge'; 
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};
 
type Props = {
  users: {
    data: User[];
    current_page: number;
    per_page: number;
    total: number;
  };
  flash?: {
    success?: string;
    error?: string;
  };
};

const UsersMaintenancePage: React.FC<Props> = ({ users }) => {
    const toast = useRef<Toast>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const { __ } = useLang();
 
    const [loadingButton, setLoadingButton] = useState<{
    id: number | null;
    action: string | null;
    }>({ id: null, action: null });
 
    const [currUsers, setCurrUsers] = useState(users.data); 
     useEffect(() => {
       setCurrUsers(users.data);
    }, [users]);

    const [tableKey, setTableKey] = useState(0); 

    useEffect(() => {
    if (flash.success) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: flash.success });
    }
    if (flash.error) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }
    }, [flash]);

    const breadcrumbs: BreadcrumbItem[] = [
    { title: __('profile.users'), href: route('users.index') },
    ];

    const onPage = (e: DataTablePageEvent) => {
    const page = (e.page ?? 0) + 1;
    router.get(route('users.index'), { page, search: globalFilter }, { preserveScroll: true, preserveState: true });
    };
   
  const confirmDelete = (user: User, onSuccess?: () => void) => { 
    confirmDialog({
      message: (
        <div>
          <p>{__('label.delete_message')}</p>
          <p>{__('profile.name')}: {user.name}</p>
          <p>{__('profile.email')}: {user.email}</p>
        </div>
      ),
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: __('label.yes'),
      rejectLabel: __('label.no'),
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('users.destroy', user.id), {
          preserveScroll: true,
          onSuccess: () => {
            setCurrUsers(prev => prev.filter(item => item.id !== user.id));
            onSuccess?.(); 
          },
        });
      },
      reject: () => {
        onSuccess?.(); // optional: reset loading if cancel 
      }
    });
  };

  const header = (
  <div className="flex justify-between items-center">
      <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText
          type="search"
          placeholder={__('label.search')}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          onKeyDown={(e) => {
          if (e.key === 'Enter') {
              router.get(route('users.index'), { search: e.currentTarget.value }, { preserveScroll: true, preserveState: true });
          }
          }}
      />
      </IconField>
  </div>
  );

return ( 
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={__('profile.users')} />
        <Toast ref={toast} />

        <div className="p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">{__('profile.users')}</h2>
              <AuthButton
                permission='users.create'
                label={__('button.add')}
                icon="pi pi-plus" 
                onClick={() => { 
                setLoadingButton({ id: null, action: 'add' });
                router.visit(route('users.create'), {
                    onFinish: () => setLoadingButton({ id: null, action: null }),
                });
                }}
                loading={loadingButton.action === 'add'}
                disabled={loadingButton.action === 'add'}
              />
          </div>

        <DataTable
            key={tableKey}
            value={currUsers}
            paginator
            rows={users.per_page}
            totalRecords={users.total}
            first={(users.current_page - 1) * users.per_page}
            onPage={onPage}
            lazy
            dataKey="id"
            tableStyle={{ minWidth: '40rem'}}
            header={header}
            rowClassName={() => 'hoverable-row'}
        >
            <Column
            header="#"
            body={(_, options) => (users.per_page * (users.current_page - 1)) + options.rowIndex + 1}
            style={{ width: '3rem', textAlign: 'center' }}
            />
            <Column field="name" header={__('profile.name')} />
            <Column field="email" header={__('profile.email')} />
            <Column
            field="roles"
            header={__('profile.roles')}
            body={(rowData) =>
                rowData.roles?.map((role: any, index: number) => (
                <Badge
                    key={index}
                    value={role.label} // or role.name if you prefer
                    className={`mr-2 text-white $role.name}`}
                />
                ))}
            />
            <Column
            header={__('label.actions')}
            body={(rowData) => (
                <div className="flex gap-2 justify-center">
                <AuthButton
                    permission='users.edit'
                    icon="pi pi-pencil"
                    className="p-button-sm"
                    onClick={() => {
                    setLoadingButton({ id: rowData.id, action: 'edit' });
                    setTableKey((prev) => prev + 1);
                    router.visit(route('users.edit', rowData.id), {
                        onFinish: () => setLoadingButton({ id: null, action: null }),
                    });
                    }}
                    loading={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                    disabled={loadingButton.id === rowData.id && loadingButton.action === 'edit'}
                />
                <AuthButton
                  permission='users.destroy'
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() => {
                    setLoadingButton({ id: rowData.id, action: 'delete' });
                    setTableKey((prev) => prev + 1);
                    confirmDelete(rowData, () => {
                      setLoadingButton({ id: null, action: null }); // manually reset in callback
                      setTableKey((prev) => prev + 1);
                    });
                  }}
                  loading={loadingButton.id === rowData.id && loadingButton.action === 'delete'}
                  disabled={loadingButton.id === rowData.id && loadingButton.action === 'delete'}
                />    
                </div>
            )}
            style={{ width: '10rem', textAlign: 'center' }}
            />
        </DataTable>
        </div>
    <ConfirmDialog />
    </AppLayout> 
  );
};

export default UsersMaintenancePage;
