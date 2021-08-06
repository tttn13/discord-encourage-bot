const { DataTypes, Model } = require("sequelize")

module.exports = class Responding extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            value: {
                type: DataTypes.BOOLEAN,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('NOW')
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('NOW')
            },
        }, {
            tableName: 'Responding',
            sequelize
        })
    }
}