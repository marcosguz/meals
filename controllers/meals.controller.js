// Models
const { Meal } = require("../models/meal.model");
const { Restaurant } = require("../models/restaurant.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const createMeal = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, price } = req.body;

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId: restaurant.id,
  });

  res.status(201).json({
    status: "success",
    newMeal,
  });
});

const getAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: {
      status: "active",
    },
    attributes: ["id", "name", "price", "restaurantId", "status"],
    include: [
      {
        model: Restaurant,
        required: false,
        where: { status: "active" },
        attributes: ["id", "name", "address", "rating", "status"],
      },
    ],
  });

  res.status(201).json({
    status: "success",
    meals,
  });
});

const getAllMealById = catchAsync(async (req, res, next) => {
  const { meal } = req;

  const id = meal.id;

  const mealId = await Meal.findOne({
    where: { status: "active", id: id },
    attributes: ["id", "name", "price", "restaurantId", "status"],
    include: [
      {
        model: Restaurant,
        required: false,
        where: { status: "active" },
        attributes: ["id", "name", "address", "rating", "status"],
      },
    ],
  });

  res.status(201).json({
    status: "success",
    mealId,
  });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { meal, sessionUser } = req;
  const { name, price } = req.body;
  const role = sessionUser.role;

  if (role === "admin") {
    await meal.update({ name, price });
  } else {
    return next(new AppError("admin permission required", 400));
  }

  res.status(201).json({ status: "success", meal });
});

const deteleMeal = catchAsync(async (req, res, next) => {
  const { meal, sessionUser } = req;
  const role = sessionUser.role;

  if (role === "admin") {
    await meal.update({ status: "disabled" });
  } else {
    return next(new AppError("admin permission required", 400));
  }

  res.status(201).json({ status: "success", meal });
});

module.exports = {
  createMeal,
  getAllMeals,
  getAllMealById,
  updateMeal,
  deteleMeal,
};
