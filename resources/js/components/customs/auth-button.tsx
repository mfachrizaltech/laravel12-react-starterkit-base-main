import React from 'react';
import { Button, ButtonProps } from 'primereact/button';
import { usePage } from '@inertiajs/react';

type AuthButtonProps = ButtonProps & {
  permission: string;
};

type PageProps = {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
    roles: string[];          // e.g. ['admin', 'superuser']
    permissions: string[];    // e.g. ['order.edit', 'order.delete']
  };
};

const AuthButton: React.FC<AuthButtonProps> = ({ permission, ...props }) => {
  const { auth } = usePage<PageProps>().props;

  // Check if user has "superuser" role
  const isSuperuser = auth.roles.includes('superuser');

  // Check permission or bypass if superuser
  const hasPermission = isSuperuser || auth.permissions.includes(permission);

  return <Button {...props} disabled={!hasPermission || props.disabled} />;
};

export default AuthButton;
