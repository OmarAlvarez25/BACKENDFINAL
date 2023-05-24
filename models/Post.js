const { Schema, model } = require('mongoose');

const PostSchema = Schema({
  postImg: {
    // object
    type: Object,
  },

  postDesc: {
    type: String,
  },

  postDate: {
    type: String,
  },

  postTime: {
    type: String,
  },

  owner: {
    type: Object,
    required: true,
  },

  postLikes: {
    type: Array,
  },

  postComments: {
    type: Array,
  },
});

PostSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.postId = _id;
  return object;
});

module.exports = model('Post', PostSchema);
