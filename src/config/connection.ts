import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import odbc from 'odbc';

const req = (name: keyof NodeJS.ProcessEnv): string => {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno ${name}`);
  return v;
};

// Configuración de conexión a Informix
const {
  DB_DRIVER_OC,
  DB_HOST_OC,
  DB_SERVER_OC,
  DB_SERVICE_OC,
  DB_PROTOCOL_OC,
  DB_DATABASE_OC,
  DB_USERNAME_OC,
  DB_PASSWORD_OC,
  DB_CLIENT_OC,
} = process.env;

// Configuración de conexión a IRIS
const {
  DB_DRIVER_IRIS,
  DB_HOST_IRIS,
  DB_SERVER_IRIS,
  DB_SERVICE_IRIS,
  DB_PROTOCOL_IRIS,
  DB_DATABASE_IRIS,
  DB_USERNAME_IRIS,
  DB_PASSWORD_IRIS,
  DB_CLIENT_IRIS,
} = process.env;

// Configuración de Sequelize para MySQL
const { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;
export const sequelize = new Sequelize(
  req('DB_DATABASE'),
  req('DB_USERNAME'),
  req('DB_PASSWORD'),
  {
    host: req('DB_HOST'),
    dialect: 'mysql',
    logging: false,
    timezone: '+02:00',
  }
);

// Función para crear la conexión a Informix y ejecutar una consulta
export const executeQueryInformix = async (query: string) => {
  try {
    const stringConnection = `DRIVER=${DB_DRIVER_OC};HOST=${DB_HOST_OC};SERVER=${DB_SERVER_OC};
                               SERVICE=${DB_SERVICE_OC};PROTOCOL=${DB_PROTOCOL_OC};
                               DATABASE=${DB_DATABASE_OC};UID=${DB_USERNAME_OC};
                               PWD=${DB_PASSWORD_OC};CLIENT_LOCALE=${DB_CLIENT_OC}`;
    const connection = await odbc.connect(stringConnection);
    const result = await connection.query(query);
    await connection.close();
    return result;
  } catch (err) {
    console.error('Error al conectar o ejecutar la consulta:', err);
    throw err; // Lanza el error para manejarlo en el nivel superior si es necesario
  }
};

export const executeQueryIRIS = async (query: string) => {
  try {
    // const stringConnection = `DRIVER=${DB_DRIVER_IRIS};HOST=${DB_HOST_IRIS};SERVER=${DB_SERVER_IRIS};
    //                            SERVICE=${DB_SERVICE_IRIS};PROTOCOL=${DB_PROTOCOL_IRIS};
    //                            DATABASE=${DB_DATABASE_IRIS};UID=${DB_USERNAME_IRIS};
    //                            PWD=${DB_PASSWORD_IRIS};CLIENT_LOCALE=${DB_CLIENT_IRIS}`;
    const stringConnection = `DSN=IRIS_PRO;INFORMIXSERVER=db1`;
    const connection = await odbc.connect(stringConnection);
    const result = await connection.query(query);
    await connection.close();
    return result;
  } catch (err) {
    console.error('Error al conectar o ejecutar la consulta:', err);
    throw err;
  }
};
