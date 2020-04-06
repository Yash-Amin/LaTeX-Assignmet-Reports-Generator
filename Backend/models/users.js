/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'users',
        {
            email: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true
                // primaryKey: true
            },
            password: {
                type: DataTypes.STRING(70),
                allowNull: false, 
            } ,
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
            tableName: 'users'
        }
    );
};
