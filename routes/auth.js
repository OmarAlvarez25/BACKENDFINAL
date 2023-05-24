/*
    User Routes / Auth
    host + /api/auth
 */

// Express
const { Router } = require('express');

// Validators
const { check } = require('express-validator');
const { fieldValidators } = require('../middlewares/fieldValidators');

// Controllers (functions)
const {
  userLogin,
  userRegister,
  userTokenRenew,
  getUserByUsername,
  checkIfUserExists,
  updateUser,
  getUsersByUsername,
  getUsers,
} = require('../controllers/auth');

// JWT Validator
const { jwtValidator } = require('../middlewares/jwtValidator');

const router = Router();

// @route   POST api/auth - Register
router.post(
  '/new',
  [
    // Middlewares
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('email', 'El email es requerido').isEmail(),
    check('username', 'El nombre de usuario es requerido').not().isEmpty(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    check(
      'password',
      'La contraseña debe tener al menos 6 caracteres'
    ).isLength({
      min: 6,
    }),
    check('username', 'El nombre de usuario es requerido').not().isEmpty(),
    fieldValidators,
  ],
  userRegister
);

// @route  POST api/auth - Login
router.post(
  '/login',
  [
    // Middlewares
    check('email', 'El email es requerido').isEmail(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    fieldValidators,
  ],
  userLogin
);

// @route   GET api/auth - Renew token
router.get('/renew', jwtValidator, userTokenRenew);

// @route  GET api/auth - Get user by username
router.get('/:username', getUserByUsername);

// Get all users by username (search)
router.get('/search/:username', getUsersByUsername);

// Get all users registered
router.get('/all/users', getUsers);

// check if user exists by email
router.post(
  '/check',
  [
    // Middlewares
    check('email', 'El email es requerido').isEmail(),
    check('email', 'El email no es valido')
      .isEmail()
      .matches(/@uao.edu.co$/),
    fieldValidators,
  ],
  checkIfUserExists
);

// Edit user
router.put('/:uid', updateUser);

module.exports = router;
