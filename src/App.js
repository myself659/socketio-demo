import { useEffect, useState, useRef } from "react";
// import io from socket.io-client
import { io } from 'socket.io-client';

function App() {
  const [serverDate, setServerDate] = useState('');
  // generate a reference to keep the socket persistent
  const client = useRef();

  useEffect(() => {
    // initialized socket by specified server address
    const socket = io('http://localhost:5000', {
      transports: ['websocket']
    });
    // listened to connect event
    socket.on('connect', () => console.log(`Client connected: ${socket.id}`));
    // listened to disconnect event
    socket.on('disconnect', (reason) => console.log(`Client disconnected: ${reason}`));
    // listened to connect_error event
    socket.on('connect_error', (reason) => console.log(`Client connection error: ${reason}`));

    // listened to custom event:responseDate
    socket.on('responseDate', (msg) => setServerDate(msg));
    // save client socket connection
    client.current = socket;
  }, []);

  return (
    <>

      <button
        className="App"
        // send socket.io request
        onclick={() => client.current.emit('requestDate', 'need date')}
      >
        Click to request date from server
      </button>

      <div>
        Server response: {serverDate}
      </div>
    </>
  );
}

export default App;