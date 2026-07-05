import { Model, DataTypes, Sequelize } from 'sequelize';

export class AuditLogModel extends Model {
  public id!: string;
  public queryId!: string;
  public changedByUserId!: string | null;
  public previousStatus!: string | null;
  public newStatus!: string | null;
  public comments!: string | null;
  public readonly createdAt!: Date;
}

export function initAuditLogModel(sequelize: Sequelize) {
  AuditLogModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      queryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'query_id',
      },
      changedByUserId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'changed_by_user_id',
      },
      previousStatus: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'previous_status',
      },
      newStatus: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'new_status',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'audit_logs',
      underscored: true,
      updatedAt: false,
    }
  );
}
