let userInfo = {};

(function () {
    const server = 'http://127.0.0.1:3000'
    const socket = io(server);

    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);
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
            userInfo = data
            let element = document.getElementsByClassName("page-loader")[0];
            element.classList.add("fade-out");
            setTimeout(() => {
                element.remove();
            }, 1000);
        }
    })
})()