const socket = io();
const app = document.querySelector('.app');
let uname;

app.querySelector('.join-screen #join-user').addEventListener('click', function() {

    let username = app.querySelector('.join-screen #username').value;
    if(username.length == 0) {
        return;
    }
    // Send event newuser with username from back app
    socket.emit('newuser', username);
    uname = username;
    app.querySelector('.join-screen').classList.remove('active');
    app.querySelector('.chat-screen').classList.add('active');

});    

app.querySelector('.chat-screen #send-message').addEventListener('click', function() {

    let message = app.querySelector('.chat-screen #message-input').value;
    if(message.length == 0) {
        return;
    }

    renderMessage('my', {username: uname, text: message});
    // Send event chat with username + message value from back app
    socket.emit('chat', { username: uname, text: message});
    app.querySelector('.chat-screen #message-input').value = '';
});

// function that render message in function of value of first param(type) in front slide
function renderMessage(type, message) {

    let messageContainer = app.querySelector('.chat-screen .messages');
    if(type == 'my') {
        let  element = document.createElement('div');
        element.setAttribute('class', 'message my-message');
        element.innerHTML = `
        <div>
            <div class='name'>You</div>
            <div class='text'>${message.text}</div>
        </div>
        `;
        messageContainer.appendChild(element);
    } else if( type == 'other') { 
        let  element = document.createElement('div');
        element.setAttribute('class', 'message other-message');
        element.innerHTML = `
        <div>
            <div class='name'>${message.username}</div>
            <div class='text'>${message.text}</div>
        </div>
        `;
        messageContainer.appendChild(element);
    } else if (type == 'update') {
        let element = document.createElement('div');
        element.setAttribute('class', 'update');
        element.innerText = message;
        messageContainer.appendChild(element);
    }
    // scroll chat to end 
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
};

app.querySelector('.chat-screen #exit-chat').addEventListener('click', function() {

    // Send event exituser with username from back app
    socket.emit('exituser', uname); 
    window.location.href = window.location.href;
});

// Listenning event update come form back app and change type by default(my) in (update) of function renderMessage
socket.on('update', function(update) {

    renderMessage('update', update);
});

// Listenning event chat come form back app and change type by default(my) in (other) of function renderMessage
socket.on('chat', function(message) {

    renderMessage('other', message);
}); 
