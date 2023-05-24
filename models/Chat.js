const { Schema, model } = require('mongoose');

const ChatSchema = Schema({
  chat: {
    messages: [
      {
        message: {
          type: String,
        },
        sender: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        date: {
          type: String,
        },
        time: {
          type: String,
        },
      },
    ],

    user1: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user2: {
      // From user model
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
});

ChatSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.chatId = _id;
  return object;
});

module.exports = model('Chat', ChatSchema);
