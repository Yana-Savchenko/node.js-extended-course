const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_course', 'user', '1234', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;