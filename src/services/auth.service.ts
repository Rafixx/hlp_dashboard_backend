import { Usuario } from '../models/Usuario';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { Rol } from '../models/Rol';

interface LoginDTO {
  username: string;
  password: string;
}

interface LoginResponseDTO {
  token: string;
  user: {
    id_usuario: number;
    username: string;
    nombre: string | null;
    email: string;
    rol_name?: string;
  };
}

export class AuthService {
  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    if (process.env.AUTH_SOURCE === 'json') {
      return this.loginFromJson(data);
    }

    const usuario = await Usuario.findOne({
      where: { username: data.username },
      include: [
        {
          model: Rol,
          as: 'rol',
          attributes: ['name'],
        },
      ],
    });

    if (!usuario) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    const passwordValid = await bcrypt.compare(
      data.password,
      usuario.passwordhash
    );

    if (!passwordValid) {
      throw new UnauthorizedError('Contraseña incorrecta');
    }

    const rolName = usuario.rol?.name || 'desconocido';

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        username: usuario.username,
        rol_name: rolName,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        nombre: usuario.nombre,
        email: usuario.email,
        rol_name: rolName,
      },
    };
  }

  private async loginFromJson(data: LoginDTO): Promise<LoginResponseDTO> {
    const filePath = path.resolve(__dirname, '../config/users.json');
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const users: Array<{
      id_usuario: number;
      username: string;
      passwordhash: string;
      nombre: string | null;
      email: string;
      rol_name?: string;
    }> = JSON.parse(fileContent);

    const usuario = users.find((u) => u.username === data.username);

    if (!usuario) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    //****************************************************** */
    const passwordValid = true; //TODO LIST
    //****************************************************** */

    // const passwordValid = await bcrypt.compare(
    //   data.password,
    //   usuario.passwordhash
    // );

    if (!passwordValid) {
      throw new UnauthorizedError('Contraseña incorrecta');
    }

    const rolName = usuario.rol_name || 'desconocido';

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        username: usuario.username,
        rol_name: rolName,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        nombre: usuario.nombre,
        email: usuario.email,
        rol_name: rolName,
      },
    };
  }
}
