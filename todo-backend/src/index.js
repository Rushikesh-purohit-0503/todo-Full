require('dotenv').config({ path: '../.env' })
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const  socketIo  = require('socket.io');
const route = require('./routers/index')
const app = express()
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST']
    }
})

app.get('/', (req, res) => res.send('Hello, world!'));
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


app.use('/api', route)
app.set('io', io)

module.exports = {io,app,server}  