import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
// Importar tus rutas aquí
import { authRoutes } from './routes/auth.routes';
import { usuarioRoutes } from './routes/usuario.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Registrar las rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/login', authRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
