import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
// Importar tus rutas aquí
import { authRoutes } from './routes/auth.routes';
import { usuarioRoutes } from './routes/usuario.routes';
import { adxRoutes } from './routes/adx.routes';
import { enfRoutes } from './routes/enf.routes';
import { fisioRoutes } from './routes/fisio.routes';
import { genRoutes } from './routes/gen.routes';
import { medRoutes } from './routes/med.routes';
import { tscRoutes } from './routes/tsc.routes';
import { preveRoutes } from './routes/preve.route';

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
app.use('/api/gen', genRoutes)
app.use('/api/med', medRoutes);
app.use('/api/tsc', tscRoutes);
app.use('/api/preve', preveRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
