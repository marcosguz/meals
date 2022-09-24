const express = require("express");

// Controllers
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deteleRestaurant,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/restaurants.controller");

// Middlewares
const {
  createRestaurantValidators,
  createReviewValidators,
} = require("../middlewares/validators.middlewares");

const { restaurantExists } = require("../middlewares/restaurants.middlewares");
const { reviewExists } = require("../middlewares/reviews.middlewares");

const { protectSession } = require("../middlewares/auth.middlewares");

const restaurantsRouter = express.Router();

restaurantsRouter.get("/", getAllRestaurants);
restaurantsRouter.get("/:id", restaurantExists, getRestaurantById);

restaurantsRouter.use(protectSession);

restaurantsRouter.post("/", createRestaurantValidators, createRestaurant);

restaurantsRouter.post(
  "/reviews/:restaurantId",
  createReviewValidators,
  restaurantExists,
  createReview
);

restaurantsRouter
  .use("/reviews/:reviewId", reviewExists)
  .route("/reviews/:reviewId")
  .patch(updateReview)
  .delete(deleteReview);

restaurantsRouter
  .use("/:id", restaurantExists)
  .route("/:id")
  .patch(updateRestaurant)
  .delete(deteleRestaurant);

module.exports = { restaurantsRouter };
