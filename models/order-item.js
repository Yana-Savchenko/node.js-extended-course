const Sequelize = require('sequelize');

const db = require('../helpers/database');

const OrderItem = db.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER,
})

module.exports = OrderItem;