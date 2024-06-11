//index.js
$(document).ready(() => {
	const socket = io.connect();

	let currentUser;

	//Call to server to get online users
	socket.emit('get online users');

	$('#create-user-btn').click((e) => {
		e.preventDefault();
		if ($('#username-input').val().length > 0) {
			socket.emit('new user', $('#username-input').val());
			currentUser = $('#username-input').val();
			$('.username-form').remove();
			// Have the main page visible
			$('.main-container').css('display', 'flex');
		}
	});

	// Emit message to Server
	$('#send-chat-btn').click((e) => {
		e.preventDefault();
		// Get the message text value
		let message = $('#chat-input').val();
		// Make sure it's not empty
		if (message.length > 0) {
			// Emit the message with the current user to the server
			socket.emit('new message', {
				sender: currentUser,
				message: message,
			});
			$('#chat-input').val('');
		}
	});

	// Recieve the online users object and display it
	socket.on('get online users', (onlineUsers) => {
		//Our usernames are keys in the object of onlineUsers.
		for (username in onlineUsers) {
			$('.users-online').append(`<div class="user-online">${username}</div>`);
		}
	});

	//Recieve and Output the new message from server
	socket.on('new message', (data) => {
		$('.message-container').append(`
    <div class="message">
      <p class="message-user">${data.sender}: </p>
      <p class="message-text">${data.message}</p>
    </div>
  `);
	});

	//Output the new user when they join
	socket.on('new user', (username) => {
		console.log(`${username} has joined the chat`);
		// Add the new user to the online users div
		$('.users-online').append(`<div class="user-online">${username}</div>`);
	});

	//Refresh the online user list
	socket.on('user has left', (onlineUsers) => {
		$('.users-online').empty();
		for (username in onlineUsers) {
			$('.users-online').append(`<p>${username}</p>`);
		}
	});
});
