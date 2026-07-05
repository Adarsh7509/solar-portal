import { sequelize } from '../config/database';
import { UserModel, initUserModel } from './User';
import { QueryModel, initQueryModel } from './Query';
import { AuditLogModel, initAuditLogModel } from './AuditLog';

// Initialize models
initUserModel(sequelize);
initQueryModel(sequelize);
initAuditLogModel(sequelize);

// Associations
// 1. Query <-> User (Assigned Admin)
QueryModel.belongsTo(UserModel, {
  foreignKey: 'assignedAdminId',
  as: 'assignedAdmin',
  onDelete: 'SET NULL',
});
UserModel.hasMany(QueryModel, {
  foreignKey: 'assignedAdminId',
  as: 'queries',
});

// 2. AuditLog <-> Query
AuditLogModel.belongsTo(QueryModel, {
  foreignKey: 'queryId',
  as: 'query',
  onDelete: 'CASCADE',
});
QueryModel.hasMany(AuditLogModel, {
  foreignKey: 'queryId',
  as: 'auditLogs',
});

// 3. AuditLog <-> User (Changed By User)
AuditLogModel.belongsTo(UserModel, {
  foreignKey: 'changedByUserId',
  as: 'changedByUser',
  onDelete: 'SET NULL',
});

export { sequelize, UserModel, QueryModel, AuditLogModel };
