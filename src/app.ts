import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
// Importar tus rutas aquí
import { authRoutes } from './routes/auth.routes';
import { usuarioRoutes } from './routes/usuario.routes';
import { adxRoutes } from './routes/adx.routes';
import { enfRoutes } from './routes/enf.routes';
import { fisioRoutes } from './routes/fisio.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenido a la API');
});

// Registrar las rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/login', authRoutes);
app.use('/api/adx', adxRoutes);
app.use('/api/enf', enfRoutes);
app.use('/api/fisio', fisioRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
