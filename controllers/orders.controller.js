// Models
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
const { AppError } = require('../utils/appError.util');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const createOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { mealId, quantity } = req.body;

  const meal = await Meal.findOne({
    where: { status: 'active', id: mealId },
  });

  const total = meal.price * quantity;

  const newOrder = await Order.create({
    mealId,
    userId: sessionUser.id,
    totalPrice: total,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    newOrder,
  });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const order = await Order.findAll({
    where: { userId: sessionUser.id },
    attributes: ['id', 'mealId', 'userId', 'totalPrice', 'quantity', 'status'],
    include: [
      {
        model: Meal,
        required: false,
        where: { status: 'active' },
        attributes: ['id', 'name', 'price', 'restaurantId', 'status'],
        include: [
          {
            model: Restaurant,
            required: false,
            where: { status: 'active' },
            attributes: ['id', 'name', 'address', 'rating', 'status'],
          },
        ],
      },
    ],
  });

  res.status(201).json({
    status: 'success',
    order,
  });
});

const completedOrder = catchAsync(async (req, res, next) => {
  const { order, sessionUser } = req;

  if (sessionUser.id === order.userId) {
    if (order.status === 'active') {
      await order.update({ status: 'completed' });
    } else {
      return next(new AppError('the order is not active', 400));
    }
  } else {
    return next(new AppError('not the author of the order', 400));
  }

  res.status(201).json({ status: 'success', order });
});

const cancelledOrder = catchAsync(async (req, res, next) => {
  const { order, sessionUser } = req;

  if (sessionUser.id === order.userId) {
    if (order.status === 'active') {
      await order.update({ status: 'cancelled' });
    } else {
      return next(new AppError('the order is not active', 400));
    }
  } else {
    return next(new AppError('not the author of the order', 400));
  }

  res.status(201).json({ status: 'success', order });
});

module.exports = { createOrder, getAllOrders, completedOrder, cancelledOrder };
