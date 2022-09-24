const express = require("express");

// Controllers
const {
  getAllOrders,
  getOrderById,
  createUser,
  updateUser,
  deleteUser,
  login,
  getAllUsers,
} = require("../controllers/users.controller");

// Middlewares
const {
  createUserValidators,
} = require("../middlewares/validators.middlewares");

const { userExists } = require("../middlewares/users.middlewares");
const { orderExists } = require("../middlewares/orders.middlewares");

const {
  protectSession,
  protectUserAccount,
} = require("../middlewares/auth.middlewares");

const usersRouter = express.Router();

usersRouter.post("/signup", createUserValidators, createUser);

usersRouter.post("/login", login);

usersRouter.use(protectSession);

usersRouter.get("/", getAllUsers);

usersRouter.get("/orders", getAllOrders);
usersRouter.get("/orders/:id", orderExists, getOrderById);

usersRouter
  .use("/:id", userExists)
  .route("/:id")
  .patch(protectUserAccount, updateUser)
  .delete(protectUserAccount, deleteUser);

module.exports = { usersRouter };
