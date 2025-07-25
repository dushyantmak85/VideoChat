const socket = io('/');
const videoGrid = document.getElementById('videoGrid');
const myPeer = new Peer(undefined, {
    host: '/',
    port: 3001
});

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers={}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    addVideoStream(myVideo, stream);
    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });

        call.on('close', () => {
            video.remove();
        });
      
    });

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
        console.log("User connected: " + userId);
    });
})

myPeer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id);
});

socket.on('user-disconnected',userId=>{
    if(peers[userId]){
        peers[userId].close();
    }
});

    


function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.style.transform = 'scaleX(-1)';
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    peers[userId] = call;
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
        console.log("Received remote stream");
    })

    call.on('close', () => {
        video.remove();
    })
}