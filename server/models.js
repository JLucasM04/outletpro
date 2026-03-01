import { DataTypes } from 'sequelize';
import { sequelize } from './config.js';

export const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
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
    allowNull: false,
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  passwordHash: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
  }
});

Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

export async function initDb() {
  await sequelize.sync({ alter: true });
}
