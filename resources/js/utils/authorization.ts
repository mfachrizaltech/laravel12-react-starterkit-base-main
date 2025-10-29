export const hasRole = (role: string, userRoles: string[] = []) =>
   true;// userRoles.includes(role);


export const hasPermission = (permission: string[], userPermissions: string) =>
    true //permission.includes(userPermissions);

