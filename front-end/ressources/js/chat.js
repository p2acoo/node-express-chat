let userInfo = {};

(function () {
    const server = 'http://127.0.0.1:3000'
    const socket = io(server, { auth: { token: localStorage.getItem('token') } });

    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);
    })

    socket.on('message', (data) => {
        console.log(data);
        let message = data.message;
        let username = data.username;
        let userId = data.userId;
        addMessage(message, username, userId);

    })

    fetch(`${server}/api/user/getSelf`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    ).then((res) => {
        if (res.status == 200) {
            return res.json()
        } else {
            document.location.href = '/front-end/auth/login.html';
        }
    }).then((data) => {
        if (data.id) {
            userInfo = data;

            fetch(`${server}/api/message`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                return res.json()
            }).then((data) => {
                data.forEach((message) => {
                    addMessage(message.message, message.username, message.userId);

                    let element = document.getElementsByClassName("page-loader")[0];

                    element.classList.add("fade-out");
                    setTimeout(() => {
                        element.remove();
                    }, 1000);
                })
            })
        }
    })



    function sendMessage() {
        let message = document.getElementById('message-input').value;
        document.getElementById('message-input').value = '';
        socket.emit('sendMessage', { message });
    }

    function addMessage(message, username, userId) {
        let messageContainer = document.getElementById('chat-list');
        let messageElement = document.createElement('li');
        if (userId === userInfo.id) {
            messageElement.classList.add('me');
        }
        messageElement.innerHTML = `
            <div class="name">
                <span class="">${username}</span>
            </div>
            <div class="message">
                <p>${message}</p>
                <span class="msg-time">5:00 pm</span>
            </div>`

        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }


    document.getElementById('send-btn').addEventListener('click', () => sendMessage);

    document.getElementById('message-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') sendMessage();
    })

})()

