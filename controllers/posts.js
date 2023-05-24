const { response } = require('express');

const Post = require('../models/Post');

// Cloudinary
var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dk6pyc5a7',
  api_key: '583917991988912',
  api_secret: 'qkZWL2TeM0zAw6JL9IgfAhfoiPI',
  secure: true,
});

// Get all posts and order by postDate
const getPosts = async (req, res = response) => {
  const posts = await Post.find().sort({
    postTime: -1,
  });

  res.json({
    ok: true,
    posts,
  });
};

// Get post by id
const getPostById = async (req, res = response) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);

  res.json({
    ok: true,
    post,
  });
};

// Get all posts by owner id and the id is inside an object in the owner field
const getPostsByOwnerId = async (req, res = response) => {
  const { id } = req.params;

  let posts = [];

  try {
    posts = await Post.find({ 'owner.uid': id });

    if (!posts) {
      return res.status(404).json({
        ok: false,
        msg: 'No hay publicaciones',
      });
    }

    res.json({
      ok: true,
      posts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

// Create post
const createPost = async (req, res = response) => {
  const post = new Post(req.body);

  try {
    // post.owner = req.uid;

    await post.save();

    res.json({
      ok: true,
      post,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

// Update post
const updatePost = async (req, res = response) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        ok: false,
        msg: 'La publicacion no existe',
      });
    }

    // if (post.owner.toString() !== req.uid) {
    //   return res.status(401).json({
    //     ok: false,
    //     msg: 'No tiene privilegios para editar esta publicacion',
    //   });
    // }

    const newPost = {
      ...req.body,
    };

    const updatedPost = await Post.findByIdAndUpdate(postId, newPost, {
      new: true,
    });

    res.json({
      ok: true,
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

// Delete post
const deletePost = async (req, res = response) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        ok: false,
        msg: 'La publicacion no existe',
      });
    }

    if (post.owner.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegios para eliminar esta publicacion',
      });
    }
    // Delete images from cloudinary
    const images = post.files;

    if (images.length > 0) {
      const publicIds = [];

      images.forEach((img) => {
        publicIds.push(img.id);
      });

      await cloudinary.api.delete_resources(publicIds);
    }

    await Post.findByIdAndDelete(postId);

    res.json({
      ok: true,
      msg: 'Publicacion eliminada',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

const deleteFileFromCloudinary = async (req, res = response) => {
  const { id } = req.params;

  try {
    await cloudinary.uploader.destroy(`uao-app/${id}`);

    res.json({
      ok: true,
      msg: 'deleteFileFromCloudinary',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

module.exports = {
  getPosts,
  getPostById,
  getPostsByOwnerId,
  createPost,
  updatePost,
  deletePost,
  deleteFileFromCloudinary,
};
