const { response } = require('express');

// Password encryption
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');

// JWT
const { generateJWT } = require('../helpers/jwt');

const userRegister = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un usuario con este correo electronico',
      });
    }

    user = new User(req.body);

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    user.photoURL = `https://source.boringavatars.com/marble/50/${user.username}`;

    // Save user in DB
    await user.save();

    // Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      user,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

const userLogin = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese correo',
      });
    }

    // Confirm passwords
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'La contraseña es incorrecta',
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      user,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

// Check if user with this email exists on DB
const checkIfUserExists = async (req, res = response) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        ok: false,
        exist: true,
        msg: 'Ya existe un usuario con este nombre de usuario',
      });
    }

    res.status(200).json({
      ok: true,
      exist: false,
      msg: 'No existe un usuario con este nombre de usuario',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      exist: true,
      msg: 'Please contact the administrator',
    });
  }
};

const userTokenRenew = async (req, res = response) => {
  const { uid, name } = req;

  // Generate JWT
  const token = await generateJWT(uid, name);

  const user = await User.findById(uid);

  res.json({
    ok: true,
    uid,
    user,
    token,
  });
};

const getUserByUsername = async (req, res = response) => {
  const { username } = req.params;
  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: 'El usuario no existe',
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error trayendo la informacion del usuario, intente de nuevo mas tarde',
    });
  }
};

// Edit user
const updateUser = async (req, res = response) => {
  const { uid } = req.params;

  try {
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: 'El usuario no existe',
      });
    }

    const newUser = {
      ...req.body,
    };

    const updatedUser = await User.findByIdAndUpdate(uid, newUser, {
      new: true,
    });

    res.json({
      ok: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error trayendo la informacion del usuario, intente de nuevo mas tarde',
    });
  }
};

// Get all users by username (search)
const getUsersByUsername = async (req, res = response) => {
  const { username } = req.params;

  try {
    const users = await User.find({
      username: { $regex: username, $options: 'i' },
    });

    if (!users) {
      return res.status(404).json({
        ok: false,
        msg: 'No hay usuarios',
      });
    }

    res.json({
      ok: true,
      users,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

// Get all users
const getUsers = async (req, res = response) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).json({
        ok: false,
        msg: 'No hay usuarios',
      });
    }

    res.json({
      ok: true,
      users,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

module.exports = {
  userLogin,
  userRegister,
  userTokenRenew,
  getUserByUsername,
  checkIfUserExists,
  updateUser,
  getUsersByUsername,
  getUsers,
};
