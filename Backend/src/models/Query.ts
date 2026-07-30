import { Model, DataTypes, Sequelize } from 'sequelize';

export enum QueryStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  QUOTED = 'QUOTED',
  CLOSED = 'CLOSED',
}

export class QueryModel extends Model {
  public id!: string;
  public name!: string;
  public email!: string | null;
  public phone!: string;
  public address!: string;
  public city!: string;
  public monthlyElectricityBill!: number;
  public solarCapacityInterested!: string | null;
  public message!: string | null;
  public status!: QueryStatus;
  public assignedAdminId!: string | null;
  public adminNotes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initQueryModel(sequelize: Sequelize) {
  QueryModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmailOrEmpty(value: any) {
            if (value && value.trim() !== '') {
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                throw new Error('Invalid email address format');
              }
            }
          }
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      monthlyElectricityBill: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'monthly_electricity_bill',
      },
      solarCapacityInterested: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'solar_capacity_interested',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(QueryStatus)),
        defaultValue: QueryStatus.PENDING,
        allowNull: false,
      },
      assignedAdminId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'assigned_admin_id',
      },
      adminNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'admin_notes',
      },
    },
    {
      sequelize,
      tableName: 'customer_queries',
      underscored: true,
    }
  );
}
