/*
    post Routes
    host + /api/posts
*/

const express = require('express');

// Controllers
const {
  getPosts,
  getPostById,
  getPostsByOwnerId,
  createPost,
  updatePost,
  deletePost,
  deleteFileFromCloudinary,
} = require('../controllers/posts');

// Form Validators
const { check } = require('express-validator');
const { fieldValidators } = require('../middlewares/fieldValidators');

// JWT
const { jwtValidator } = require('../middlewares/jwtValidator');

// Date validator
const { isDate } = require('../helpers/isDate');

const router = express.Router();

router.use(jwtValidator);

// Get posts
router.get('/', getPosts);

// get post by id
router.get('/post/:id', getPostById);

// Get posts by owner id
router.get('/post/owner/:id', getPostsByOwnerId);

// Create post
router.post(
  '/',
  [
    check('postImg', 'La imagen de la publicacion es requerida')
      .not()
      .isEmpty(),
    fieldValidators,
  ],
  createPost
);

// Update post
router.put('/post/:id', updatePost);

// Delete post
router.delete('/delete/:id', deletePost);

router.delete('/file/insta/:id', deleteFileFromCloudinary);

module.exports = router;
