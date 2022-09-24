const express = require("express");

// Controllers
const {
  createOrder,
  getAllOrders,
  completedOrder,
  cancelledOrder,
} = require("../controllers/orders.controller");

// Middlewares
const {
  createOrderValidators,
} = require("../middlewares/validators.middlewares");

const { orderExists } = require("../middlewares/orders.middlewares");
const { mealExists } = require("../middlewares/meals.middlewares");

const { protectSession } = require("../middlewares/auth.middlewares");

const ordersRouter = express.Router();

ordersRouter.use(protectSession);

ordersRouter.post("/", mealExists, createOrderValidators, createOrder);

ordersRouter.get("/me", getAllOrders);

ordersRouter
  .use("/:id", orderExists)
  .route("/:id")
  .patch(completedOrder)
  .delete(cancelledOrder);

module.exports = { ordersRouter };
