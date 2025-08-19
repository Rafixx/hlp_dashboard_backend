import { Usuario } from '../../models/Usuario';
import { Rol } from '../../models/Rol';

export const createMockUsuario = (overrides: Partial<Usuario> = {}): Usuario =>
  ({
    id_usuario: 1,
    nombre: 'Mock User',
    username: 'mockuser',
    email: 'mock@example.com',
    passwordhash: 'mockhash',
    id_rol: 1,
    created_by: 1,
    updated_by: 1,
    update_dt: new Date(),
    ...overrides,
  }) as Usuario;

export const createMockRol = (overrides: Partial<Rol> = {}): Rol =>
  ({
    id_rol: 1,
    name: 'admin',
    management_users: true,
    read_only: false,
    export: true,
    update_dt: new Date(),
    ...overrides,
  }) as Rol;
