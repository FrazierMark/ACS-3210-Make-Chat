//App.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const { engine } = require('express-handlebars');

//Socket.io
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  // Listener that fires whenever a new user connects
	console.log('🔌 New user connected! 🔌');

	
	require('./sockets/chat.js')(io, socket);
});

//Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use('/public', express.static('public'))

app.get('/', (req, res) => {
	res.render('index.handlebars');
});

server.listen('3000', () => {
	console.log('Server listening on Port 3000');
});
