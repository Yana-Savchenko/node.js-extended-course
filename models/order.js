const Sequelize = require('sequelize');

const db = require('../helpers/database');


const Order = db.define('order', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  }
});

module.exports = Order;