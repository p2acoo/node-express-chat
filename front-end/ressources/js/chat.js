let userInfo = {};
let numberOfMessage = 0;

(function () {
    const server = 'http://172.20.10.10:3000'
    const socket = io(server, { auth: { token: localStorage.getItem('token') } });

    socket.on('message', (data) => {
        console.log(data);
        let message = data.message;
        let username = data.username;
        let userId = data.userId;
        numberOfMessage++;
        document.getElementById('nb-messages').innerHTML = numberOfMessage;

        addMessage(message, username, userId, new Date());

    })

    document.getElementById("modal-close-button").addEventListener('click', closeModal)

    function closeModal() {
        const modalContainer = document.getElementById('modal-container')
        modalContainer.classList.remove('show-modal');
    }

    socket.on('listConnectedUsers', (data) => {
        let list = document.getElementById('list-connected-users');
        list.innerHTML = '';
        listUsers = data;
        data.forEach((user) => {
            let li = document.createElement('li');
            li.innerHTML = `<li><span class="status online"><i class="fa fa-circle-o"></i></span><span>${user.username}</span>
							</li>`;
            li.addEventListener('click', () => {
                fetch(`${server}/api/user/${user.userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then((res) => {

                    return res.json()
                }
                ).then((data) => {
                    document.getElementById('modal-username').innerHTML = data.username;
                    document.getElementById('modal-nb-messages').innerHTML = data.numberOfMessages;
                    document.getElementById('modal-id').innerHTML = data.id;

                    document.getElementById('modal-container').classList.add('show-modal');
                })
            })
            list.appendChild(li);

        }
        )
    })



    fetch(`${server}/api/user/self`,
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
                numberOfMessage = dataMessage.length;
                document.getElementById('nb-messages').innerHTML = numberOfMessage;

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

