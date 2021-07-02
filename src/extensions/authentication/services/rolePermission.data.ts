import {Permission} from '../models';

export const Permissions: Permission[] = [];

export const roles = [
  {
    id: 'admin',
    description: 'admin',
    permissions: ['*'],
    type: 'admin',
    name: 'Admin',
  },
];

export const findRoleByPermission = (permission: string) => {
  const foundRole = Permissions.find(
    _permission => _permission.id === permission,
  );
  return foundRole?.roles;
};

export const findPermissionByRole = (role: string) => {
  const foundPermission = Permissions.filter(permissions =>
    permissions?.roles?.includes(role),
  );
  return foundPermission ? (foundPermission || []).map(p => p.id) : [];
};
