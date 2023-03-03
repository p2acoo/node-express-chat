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
        addMessage(message, username, userId, new Date());

    })

    socket.on('listConnectedUsers', (data) => {
        console.log("listConnectedUsers", data);
        let list = document.getElementById('list-connected-users');
        list.innerHTML = '';
        data.forEach((user) => {
            let li = document.createElement('li');
            li.innerHTML = `<li><span class="status online"><i class="fa fa-circle-o"></i></span><span>${user}</span>
							</li>`;
            list.appendChild(li);
        }
        )
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
    }).then((dataSelf) => {
        if (dataSelf.id) {
            userInfo = dataSelf;

            fetch(`${server}/api/message`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((resSelf) => {
                return resSelf.json()
            }).then(async (dataMessage) => {
                await dataMessage.forEach((message) => {
                    addMessage(message.message, message.username, message.userId, message.timestamp);
                })
                let element = document.getElementsByClassName("page-loader")[0];

                document.getElementsByClassName('chat-list')[0].scrollTop = document.getElementsByClassName('chat-list')[0].scrollHeight;

                element.classList.add("fade-out");
                setTimeout(() => {
                    element.remove();
                }, 1000);

            }

            )
        }
    })



    function sendMessage() {
        let message = document.getElementById('message-input').value;
        document.getElementById('message-input').value = '';
        socket.emit('sendMessage', { message });
    }

    function addMessage(message, username, userId, timestamp) {
        let messageContainer = document.getElementById('chat-list');
        let messageElement = document.createElement('li');
        let time = new Date(timestamp);
        let now = new Date();
        let timeString = '';
        if (time.getDate() !== now.getDate() || time.getMonth() !== now.getMonth() || time.getFullYear() !== now.getFullYear()) {
            timeString = time.getDate() + '/' + (time.getMonth() < 10 ? "0" : "") + time.getMonth() + '/' + time.getFullYear() + ' '
        }
        timeString += time.getHours() + ':' + (time.getMinutes() < 10 ? "0" : "") + time.getMinutes();
        if (userId === userInfo.id) {
            messageElement.classList.add('me');
        }
        messageElement.innerHTML = `
            <div class="name">
                <span class="">${username}</span>
            </div>
            <div class="message">
                <p>${message}</p>
                <span class="msg-time">${timeString}</span>
            </div>`

        messageContainer.appendChild(messageElement);
        document.getElementsByClassName('chat-list')[0].scrollTop = document.getElementsByClassName('chat-list')[0].scrollHeight;
    }


    document.getElementById('send-btn').addEventListener('click', () => sendMessage);

    document.getElementById('message-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') sendMessage();
    })

})()

