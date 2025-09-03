const { Sequelize } = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: `${process.env.DB_NAME}.sqlite`,
});

module.exports = db;