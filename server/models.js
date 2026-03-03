import { DataTypes } from 'sequelize';
import { sequelize } from './config.js';

export const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING,
    unique: true,
  },
  responsible: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  branding: {
    type: DataTypes.JSON,
    defaultValue: {},
  }
});

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  nome: DataTypes.STRING,
  user: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
  },
  passwordHash: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM('master', 'admin', 'seller'),
    defaultValue: 'seller',
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    defaultValue: 'Ativo',
  },
}, {
  indexes: [
    { fields: ['email'] },
    { fields: ['user'] },
    { fields: ['companyId', 'role'] },
  ],
});

export const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  modules: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Inativo'),
    defaultValue: 'Ativo',
  },
}, {
  indexes: [
    { fields: ['companyId'] },
    { fields: ['status'] },
  ],
});

Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });
Company.hasMany(Contract, { foreignKey: 'companyId' });
Contract.belongsTo(Company, { foreignKey: 'companyId' });

export async function initDb() {
  await sequelize.sync({ alter: true });
}
