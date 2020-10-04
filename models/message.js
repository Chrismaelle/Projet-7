"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.message.belongsTo(models.user, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  message.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      attachement: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "message",
    }
  );
  return message;
};
