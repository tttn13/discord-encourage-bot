const { DataTypes, Model } = require("sequelize")

module.exports = class SadWord extends Model {
    static init(sequelize) {
        return super.init({
            wordId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            word: {
                type: DataTypes.STRING
            }
        }, {
            tableName: 'SadWords',
            sequelize
        })
    }
}