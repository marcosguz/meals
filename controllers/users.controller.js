const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");
const { Order } = require("../models/order.model");
const { Restaurant } = require("../models/restaurant.model");
const { Meal } = require("../models/meal.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

// Gen random jwt signs
// require('crypto').randomBytes(64).toString('hex') -> Enter into the node console and paste the command
const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Remove password from response
  newUser.password = undefined;

  // 201 -> Success and a resource has been created
  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});
const login = catchAsync(async (req, res, next) => {
  // Get email and password from req.body
  const { email, password } = req.body;

  // Validate if the user exist with given email
  const user = await User.findOne({
    where: { email, status: "active" },
  });

  // Compare passwords (entered password vs db password)
  // If user doesn't exists or passwords doesn't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Wrong credentials", 400));
  }

  // Remove password from response
  user.password = undefined;

  // Generate JWT (payload, secretOrPrivateKey, options)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});
const updateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const { user } = req;

  // Method 1: Update by using the model
  // await User.update({ name }, { where: { id } });

  // Method 2: Update using a model's instance
  await user.update({ name, email });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});
const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  // Using Soft delete
  await user.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    where: { status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: { users },
  });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const id = sessionUser.id;

  const user = await User.findOne({
    where: { status: "active", id },
    attributes: ["id", "name", "email", "status", "role"],
    include: [
      {
        model: Order,
        required: false,
        where: { status: "active" },
        attributes: [
          "id",
          "mealId",
          "userId",
          "totalPrice",
          "quantity",
          "status",
        ],
        include: [
          {
            model: Meal,
            required: false,
            where: { status: "active" },
            attributes: ["id", "name", "price", "restaurantId", "status"],
            include: [
              {
                model: Restaurant,
                required: false,
                where: { status: "active" },
                attributes: ["id", "name", "address", "rating", "status"],
              },
            ],
          },
        ],
      },
    ],
  });

  res.status(201).json({
    status: "success",
    user,
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { order } = req;
  const id = order.id;

  const orderId = await Order.findOne({
    where: { status: "active", id },
    attributes: ["id", "mealId", "userId", "totalPrice", "quantity", "status"],
    include: [
      {
        model: Meal,
        required: false,
        where: { status: "active" },
        attributes: ["id", "name", "price", "restaurantId", "status"],
        include: [
          {
            model: Restaurant,
            required: false,
            where: { status: "active" },
            attributes: ["id", "name", "address", "rating", "status"],
          },
        ],
      },
    ],
  });

  res.status(201).json({
    status: "success",
    orderId,
  });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  getAllOrders,
  getOrderById,
};
