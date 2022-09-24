// Models
const { Restaurant } = require("../models/restaurant.model");
const { Review } = require("../models/review.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(201).json({
    status: "success",
    newRestaurant,
  });
});

const getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: "active" },
    attributes: ["id", "name", "address", "rating", "status"],
    include: [
      {
        model: Review,
        required: false,
        where: { status: "active" },
        attributes: [
          "id",
          "userId",
          "comment",
          "restaurantId",
          "rating",
          "status",
        ],
      },
    ],
  });

  res.status(201).json({
    status: "success",
    restaurants,
  });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const id = restaurant.id;

  const restaurantId = await Restaurant.findOne({
    where: { status: "active", id },
    attributes: ["id", "name", "address", "rating", "status"],
    include: [
      {
        model: Review,
        required: false,
        where: { status: "active" },
        attributes: [
          "id",
          "userId",
          "comment",
          "restaurantId",
          "rating",
          "status",
        ],
      },
    ],
  });

  res.status(201).json({
    status: "success",
    restaurantId,
  });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant, sessionUser } = req;
  const { name, address } = req.body;

  const role = sessionUser.role;

  if (role === "admin") {
    await restaurant.update({ name, address });
  } else {
    return next(new AppError("admin permission required", 400));
  }

  res.status(201).json({ status: "success", restaurant });
});

const deteleRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant, sessionUser } = req;

  const role = sessionUser.role;

  if (role === "admin") {
    await restaurant.update({ status: "disabled" });
  } else {
    return next(new AppError("Admin permission is required", 400));
  }

  res.status(201).json({ status: "success" });
});

const createReview = catchAsync(async (req, res, next) => {
  const { restaurant, sessionUser } = req;
  const { comment, rating } = req.body;

  const newReview = await Review.create({
    userId: sessionUser.id,
    comment,
    restaurantId: restaurant.id,
    rating,
  });

  res.status(201).json({
    status: "success",
    newReview,
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { review, sessionUser } = req;
  const { comment, rating } = req.body;

  if (sessionUser.id === review.userId) {
    await review.update({ comment, rating });
  } else {
    return next(new AppError("not the author of the review", 400));
  }
  res.status(201).json({ status: "success", review });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { review, sessionUser } = req;

  if (sessionUser.id === review.userId) {
    await review.update({ status: "deleted" });
  } else {
    return next(new AppError("not the author of the review", 400));
  }

  res.status(201).json({ status: "success", review });
});

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deteleRestaurant,
  createReview,
  updateReview,
  deleteReview,
};
