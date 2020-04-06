/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'practicals',
        {
            name: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true
                // primaryKey: true
            },
            aim: {
                type: DataTypes.STRING(500),
                allowNull: false,
                defaultValue: '1'
            }
        },
        {
            tableName: 'practicals'
        }
    );
};
