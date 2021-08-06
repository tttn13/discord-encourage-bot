const { DataTypes, Model } = require("sequelize")

module.exports = class Message extends Model {
    static init(sequelize) {
        return super.init({
            messageId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            message: {
                type: DataTypes.STRING
            }
        }, {
            tableName: 'Messages',
            sequelize
        })
    }
}