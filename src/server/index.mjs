import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// create an Express server
const app = express();
//  wraps the server with HTTP.
const httpd = http.Server(app);
// initializes io with the HTTP wrapper.
const io = new Server(httpd);
// reads the port from the environment variable. If it is not set, the default value is 5000.
const port = process.env.PORT || 5000;
// serve the production web pages
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../build')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../build', 'index.html')));

// listens to connection event
io.on('connection', (socket) => {
    console.log(`Server connected: ${socket.id}`);
    // listen on messeage requestDate
    socket.on('requestDate', (msg) => {
        const date = new Date();
        console.log(JSON.stringify(date));
        socket.emit('responseDate', date);
        console.log(`Client message from ${socket.id} is "${msg}", and server response is "${date}"`);
        console.log(`Date's JSON string is ${JSON.stringify(date)}`);
    });
    // listen on messeage disconnect
    socket.on('disconnect', () => console.log(`Server disconnect: ${socket.id}`));
});

// starts the HTTP server at the specified port
httpd.listen(port, () => console.log(`Socket.IO server running at http://localhost:${port}/`));