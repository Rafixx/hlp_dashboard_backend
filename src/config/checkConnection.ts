import dotenv from 'dotenv';
import { sequelize } from './connection';

async function checkDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  } finally {
    try {
      await sequelize.close();
      console.log('Conexión cerrada correctamente.');
    } catch (error) {
      console.error('Error al cerrar la conexión:', error);
    }
  }
}

checkDatabaseConnection();
