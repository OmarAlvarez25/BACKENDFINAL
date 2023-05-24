const { response } = require('express');

const Chat = require('../models/chat');

// Get all chats by sender id or receiver id
const getChatsBySenderId = async (req, res = response) => {
  const { id } = req.params;

  let chats = [];

  try {
    chats = await Chat.find({
      $or: [{ 'chat.user1': id }, { 'chat.user2': id }],
    })
      .populate('chat.messages.sender', 'name username photoURL')
      .populate('chat.user1', 'name username photoURL')
      .populate('chat.user2', 'name username photoURL');

    if (!chats) {
      return res.status(404).json({
        ok: false,
        msg: 'No hay chats',
      });
    }

    res.json({
      ok: true,
      chats,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

// Get chat info
const getChat = async (req, res = response) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId)
    .populate('chat.messages.sender', 'name username photoURL')
    .populate('chat.user1', 'name username photoURL')
    .populate('chat.user2', 'name username photoURL');

  res.json({
    ok: true,
    chat,
  });
};

const createChat = async (req, res = response) => {
  const chat = new Chat(req.body);

  try {
    await chat.save();

    res.json({
      ok: true,
      chat,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    });
  }
};

const updateChat = async (req, res = response) => {
  const chatId = req.params.id;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        ok: false,
        msg: 'Chat not found',
      });
    }

    const newChat = {
      ...req.body,
    };

    const updatedChat = await Chat.findByIdAndUpdate(chatId, newChat, {
      new: true,
    });

    res.json({
      ok: true,
      chat: updatedChat,
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
  getChat,
  createChat,
  updateChat,
  getChatsBySenderId,
};
