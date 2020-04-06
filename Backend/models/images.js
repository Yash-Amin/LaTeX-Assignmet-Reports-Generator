/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'images',
        {
            uuid: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true
                // primaryKey: true
            },
            userid: {
                type: DataTypes.INTEGER(11),
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'images'
        }
    );
};
