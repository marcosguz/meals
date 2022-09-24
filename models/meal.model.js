const { db, DataTypes } = require('../utils/database.util');

const Meal = db.define('meal', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	price: {
		type: DataTypes.DECIMAL(10, 2),
		allowNull: false,
	  },
	restaurantId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	  },
	status: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'active',
	},
});

module.exports = { Meal };
