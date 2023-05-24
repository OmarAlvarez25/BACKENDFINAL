// Express
const { Router } = require('express');

// Validators
const { check } = require('express-validator');
const { fieldValidators } = require('../middlewares/fieldValidators');

// Controllers (functions)
const {
  getChatsBySenderId,
  getChat,
  createChat,
  updateChat,
} = require('../controllers/chats');

// JWT Validator
const { jwtValidator } = require('../middlewares/jwtValidator');

const router = Router();

// @route   GET api/chat - Get all messages
router.get('/:id', jwtValidator, getChatsBySenderId);

// @route   GET api/chat - Get all messages
router.get('/chat/:id', jwtValidator, getChat);

// @route   POST api/chat - Create a new message
router.post(
  '/',
  // [
  //   // Middlewares
  //   check('chat.sender.uid', 'El id del emisor es requerido').not().isEmpty(),
  //   check('chat.sender.name', 'El nombre del emisor es requerido')
  //     .not()
  //     .isEmpty(),
  //   check(
  //     'chat.sender.username',
  //     'El nombre de usuario del emisor es requerido'
  //   )
  //     .not()
  //     .isEmpty(),
  //   check('chat.receiver.uid', 'El id del receptor es requerido')
  //     .not()
  //     .isEmpty(),
  //   check('chat.receiver.name', 'El nombre del receptor es requerido')
  //     .not()
  //     .isEmpty(),
  //   check(
  //     'chat.receiver.username',
  //     'El nombre de usuario del receptor es requerido'
  //   )
  //     .not()
  //     .isEmpty(),
  //   check('chat.message', 'El mensaje es requerido').not().isEmpty(),
  //   check('chat.message', 'El mensaje debe tener al menos 1 caracter').isLength(
  //     {
  //       min: 1,
  //     }
  //   ),

  //   fieldValidators,
  // ],
  jwtValidator,
  createChat
);

// @route   PUT api/chat - Update a message
router.put('/:id', jwtValidator, updateChat);

module.exports = router;
