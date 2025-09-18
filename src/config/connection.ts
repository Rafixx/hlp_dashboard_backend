import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import odbc from 'odbc';

dotenv.config();

// --- Bootstrap Informix env (por si nodemon no hereda login shell) ---
process.env.INFORMIXDIR = '/opt/IBM/Informix_Client-SDK';
process.env.INFORMIXSQLHOSTS = `${process.env.INFORMIXDIR}/etc/sqlhosts`;
process.env.ODBCSYSINI = '/etc';
process.env.ODBCINI = '/etc/odbc.ini';
process.env.CLIENT_LOCALE = process.env.CLIENT_LOCALE || process.env.DB_CLIENT_OC || 'en_US.utf8';
process.env.LD_LIBRARY_PATH = [
  `${process.env.INFORMIXDIR}/lib`,
  `${process.env.INFORMIXDIR}/lib/cli`,
  `${process.env.INFORMIXDIR}/lib/esql`,
  process.env.LD_LIBRARY_PATH || ''
].filter(Boolean).join(':');

const req = (k: keyof NodeJS.ProcessEnv) => {
  const v = process.env[k];
  if (!v) throw new Error(`Falta variable de entorno ${k}`);
  return v;
};

// ------------ MySQL ------------
export const sequelize = new Sequelize(
  req('DB_DATABASE'),
  req('DB_USERNAME'),
  req('DB_PASSWORD'),
  { host: req('DB_HOST'), dialect: 'mysql', logging: false, timezone: '+02:00' }
);

// ------------ ODBC helpers ------------
const safeClose = async (conn?: odbc.Connection) => {
  if (!conn) return;
  try { await conn.close(); }
  catch (e: any) {
    const errs = e?.odbcErrors as Array<{state?: string; code?: number}> | undefined;
    const ignorable = errs?.some(er => er.state === 'HYC00' && er.code === -11092);
    if (!ignorable) throw e;
  }
};

const handleConnectionError = (error: unknown, dbName: string) => {
  console.error(`Error al conectar o ejecutar la consulta en ${dbName}:`, error);
};

const executeQuery = async (connectionString: string, query: string, dbName: string) => {
  let connection: odbc.Connection | undefined;
  try {
    connection = await odbc.connect(connectionString);
    // Evita transacciones implícitas al cerrar
    try { await connection.query('SET AUTOCOMMIT TO ON'); } catch {}
    return await connection.query(query);
  } catch (error) {
    handleConnectionError(error, dbName);
    throw error;
  } finally {
    await safeClose(connection);
  }
};

// ------------ Informix (elige DSN por entorno) ------------

// # NOTA: Este servidor de desarrollo apunta por defecto al entorno PRE.
// # Solo puede existir una entrada activa para cada DBSERVERNAME (ej. "db1").
// # Si se necesita trabajar contra PRO, comentar las entradas PRE y descomentar las PRO.
// # IMPORTANTE: No pueden coexistir PRO y PRE a la vez en este cliente.

const env = process.env.NODE_ENV?.toLowerCase() || 'development';
const IFX_OC_DSN  = env === 'production' ? 'ifx_oc_PRO'  : 'ifx_oc_PRE';
const IFX_IRIS_DSN= env === 'production' ? 'ifx_iris_PRO': 'ifx_iris_PRE';

export const executeQueryOC = async (query: string) => {
  const cs = `DSN=${IFX_OC_DSN};UID=${req('DB_USERNAME_OC')};PWD=${req('DB_PASSWORD_OC')};CLIENT_LOCALE=${req('DB_CLIENT_OC')}`;
  return executeQuery(cs, query, `Informix(${IFX_OC_DSN})`);
};

export const executeQueryIRIS = async (query: string) => {
  const cs = `DSN=${IFX_IRIS_DSN};UID=${req('DB_USERNAME_IRIS')};PWD=${req('DB_PASSWORD_IRIS')};CLIENT_LOCALE=${req('DB_CLIENT_IRIS')}`;
  return executeQuery(cs, query, `IRIS(${IFX_IRIS_DSN})`);
};
