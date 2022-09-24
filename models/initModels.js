// Models
const { User } = require("./user.model");
const { Restaurant } = require("./restaurant.model");
const { Review } = require("./review.model");
const { Meal } = require("./meal.model");
const { Order } = require("./order.model");

const initModels = () => {
  //1 Restaurant <----> M Reviews
  Restaurant.hasMany(Review, { foreignKey: "restaurantId" });
  Review.belongsTo(Restaurant);

  // 1 User <----> M Reviews
  User.hasMany(Review, { foreignKey: "userId" });
  Review.belongsTo(User);

  // 1 User <-> M Order
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User);
  // 1 Order <-> 1 Meal
  Meal.belongsTo(Order, { foreignKey: "mealId" });
  Order.belongsTo(Meal);
  // M Meal <-> 1 Restaurant
  Restaurant.hasMany(Meal, { foreignKey: "restaurantId" });
  Meal.belongsTo(Restaurant);
};

module.exports = { initModels };
