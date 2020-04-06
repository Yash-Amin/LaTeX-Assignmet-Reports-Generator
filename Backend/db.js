const Sequelize = require('sequelize');
const config = require('./config');
// const fs = require('fs');
// const path = require('path');
// const basename = path.basename(__filename);
 

let sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: false, 
});

sequelize
    .authenticate()
    .then(() => {
        console.log('[+] Database connected!');
    })
    .catch(err => {
        console.log('[-] Database connection error');
        console.error(err);
    });

module.exports = sequelize;
