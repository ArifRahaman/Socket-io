import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [targetSocketId, setTargetSocketId] = useState("");
  const [receivedMessage, setReceivedMessage] = useState(""); // New state variable for received messages
  const socket = useMemo(() => io("http://localhost:3000"), []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("Welcome", (e) => {
      console.log(e);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setReceivedMessage(data); // Update receivedMessage state with the received message
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Emit message to specific socketId in the room
    socket.emit("sendMessageToId", {
      roomId: room,
      targetId: targetSocketId,
      message: message,
    });

    setMessage(""); // Clear the message input after emitting
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Room:
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Socket ID:
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                value={targetSocketId}
                onChange={(e) => setTargetSocketId(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message:
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Send Message
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Received Message:
              <textarea
                className="mt-1 p-2 w-full border rounded-md"
                value={receivedMessage}
                readOnly
              ></textarea>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
