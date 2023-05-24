const express = require('express');
require('dotenv').config();

// CORS
const cors = require('cors');

// DB connection
const { dbConnection } = require('./database/config');

// Server
const app = express();

// Database
dbConnection();

// CORS options
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// CORS
app.use(cors(corsOptions));

// Public folder
app.use(express.static('public'));

// Body parser
app.use(express.json());

// Routes
// Auth
app.use('/api/auth', require('./routes/auth'));

// CRUD (Create, Read, Update, Delete)
app.use('/api/posts', require('./routes/posts'));

// chat
app.use('/api/chats', require('./routes/chat'));

// Port
app.listen(process.env.PORT, () => {
  console.log(`instaDB listening on port ${process.env.PORT}!`);
});
