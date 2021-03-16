// routes
const userRoutes = require('./routes/users');
const db = require('./db/index.js');

// Web server config
const PORT = process.env.PORT || 8080;
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const http = require('http');

const app = express();

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1'],
  })
);
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Separated Routes for each Resource
// Note: we have teachers and api
const userRouter = express.Router();
userRoutes(userRouter, db);
app.use('/teachers', userRouter);

// setup socket.io
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  const request = socket.request;
  console.log('new client connected', socket.id, request.headers);
  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('callEnded');
  });

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('register', (data) => {
    console.log('register button heared from the back end', data);
  });

  
});



if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'front-end/build')));
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'front-end/build', 'index.html'));
  });
}
server.listen(process.env.PORT || 8080, () =>
  console.log(`server is running on port ${PORT}`)
);

module.exports = app;
