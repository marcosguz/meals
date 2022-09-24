const express = require("express");

// Controllers
const {
  createMeal,
  getAllMeals,
  getAllMealById,
  updateMeal,
  deteleMeal,
} = require("../controllers/meals.controller");

// Middlewares
const {
  createMealValidators,
} = require("../middlewares/validators.middlewares");
const { restaurantExists } = require("../middlewares/restaurants.middlewares");

const { mealExists } = require("../middlewares/meals.middlewares");

const { protectSession } = require("../middlewares/auth.middlewares");

const mealsRouter = express.Router();

mealsRouter.get("/", getAllMeals);

mealsRouter.get("/:id", mealExists, getAllMealById);

mealsRouter.use(protectSession);

mealsRouter.post("/:id", restaurantExists, createMealValidators, createMeal);

mealsRouter
  .use("/:id", mealExists)
  .route("/:id")
  .patch(updateMeal)
  .delete(deteleMeal);

module.exports = { mealsRouter };
