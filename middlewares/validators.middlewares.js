const { body, validationResult } = require("express-validator");

// Utils
const { AppError } = require("../utils/appError.util");

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
    const errorMessages = errors.array().map((err) => err.msg);

    const message = errorMessages.join(". ");

    return next(new AppError(message, 400));
  }

  next();
};

const createUserValidators = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email").isEmail().withMessage("Must provide a valid email"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  checkValidations,
];

const createRestaurantValidators = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("address")
    .isString()
    .withMessage("Address must be a string")
    .isLength({ min: 3 })
    .withMessage("address must be at least 3 characters long"),
  body("rating")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be at least 1 character long"),
  checkValidations,
];

const createReviewValidators = [
  body("comment")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  body("rating")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be at least 1 character long"),
  checkValidations,
];

const createMealValidators = [
  body("name")
    .notEmpty()
    .withMessage("name cannot be empty")
    .isString()
    .withMessage("name is not a string"),
  body("price")
    .notEmpty()
    .withMessage("price cannot be empty")
    .isNumeric()
    .withMessage("price is not a number"),
  checkValidations,
];
const createOrderValidators = [
  body("mealId")
    .notEmpty()
    .withMessage("mealId cannot be empty")
    .isNumeric()
    .withMessage("mealId is not a number"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity cannot be empty")
    .isNumeric()
    .withMessage("quantity is not a number"),
  checkValidations,
];
module.exports = {
  createUserValidators,
  createRestaurantValidators,
  createReviewValidators,
  createMealValidators,
  createOrderValidators,
};
