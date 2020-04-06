/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'Session',
        {
            sid: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            userId:DataTypes.INTEGER,
            expires: DataTypes.DATE,
            data: DataTypes.STRING(50000)
        },
        {
            tableName: 'Sessions'
        }
    );
};
