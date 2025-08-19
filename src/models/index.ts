// src/models/index.ts
import { Usuario } from './Usuario';
import { Rol } from './Rol';
import type { Sequelize, ModelStatic, Model } from 'sequelize';

type ModelWithAssociate = ModelStatic<Model> & {
  associate?(models: Record<string, ModelStatic<Model>>): void;
};

export function initModels(sequelize: Sequelize) {
  // 1) Init
  Usuario.initModel(sequelize);
  Rol.initModel(sequelize);

  // 2) Ahora sí construye el map de clases
  const models = {
    Usuario,
    Rol,
  } as const;

  // 3) Asociaciones
  (Object.values(models) as ModelWithAssociate[]).forEach((m) => {
    if (typeof m.associate === 'function') {
      m.associate(models);
    }
  });

  return models;
}
