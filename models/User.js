const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'The name is required'],
  },

  email: {
    type: String,
    required: [true, 'The email is required'],
    unique: true,
  },

  username: {
    type: String,
    required: [true, 'The username is required'],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'The password is required'],
  },

  photoURL: {
    type: String,
  },

  bio: {
    type: String,
  },

  following: {
    type: Array,
  },

  followers: {
    type: Array,
  },
});

UserSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('User', UserSchema);
