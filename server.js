const express= require('express');
const app = express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const {v4:uuid} = require('uuid');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuid()}`);
});

app.get('/:room',(req,res)=>{
    res.render('room', { roomId: req.params.room });    
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    })    

    socket.on('disconnect',()=>{
        socket.to(roomId).emit('user-disconnected', socket.id);
    })
});

server.listen(3000,()=>{
    console.log('Server is running on port 3000');
})