import { Model, DataTypes, Sequelize } from 'sequelize';

export class UserModel extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initUserModel(sequelize: Sequelize) {
  UserModel.init(
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
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password_hash',
      },
      role: {
        type: DataTypes.STRING(50),
        defaultValue: 'admin',
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      underscored: true,
    }
  );
}
