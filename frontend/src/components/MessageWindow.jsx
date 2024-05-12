/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { addMessage, fetchMessages } from "./apiFunctions";

function MessageWindow({ socket, roomID, activeUser }) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [incomingMessage, setIncomingMessage] = useState();
  const [activeMessages, setActiveMessages] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    socket.emit("send", value, roomID, activeUser);
    console.log("here");
    setValue("");

    const res = await addMessage(value, activeUser, roomID);
    console.log(res);
    setActiveMessages((prev) => [
      ...prev,
      { message: value, sender: activeUser, roomid: roomID },
    ]);
  };

  useEffect(
    function () {
      socket.emit("join-room", roomID, (message) => console.log(message));

      const fetchData = async () => {
        const res = await fetchMessages(roomID);
        // setActiveMessages(res)
        console.log(res);
        setActiveMessages(res);
      };

      if (roomID !== "") fetchData();
    },
    [roomID, socket]
  );

  useEffect(
    function () {
      socket.on("receive", (message, sender) => {
        console.log(`${message} by ${sender}`);
        setIncomingMessage({
          sender,
          message,
        });
      });
    },
    [socket]
  );

  useEffect(
    function () {
      incomingMessage &&
        setActiveMessages((prev) => [...prev, incomingMessage]);
    },
    [incomingMessage]
  );
  console.log(activeMessages);

  return (
    <div className="container">
      <ul className="window">
        {activeMessages
          ? activeMessages.map((message) => {
              if (
                activeUser === message.sender.userid ||
                activeUser === message.sender
              ) {
                return (
                  <div
                    className="right-align"
                    key={`${Math.random()}${Date.now()}`}
                  >
                    {message.message}
                  </div>
                );
              } else {
                return (
                  <div
                    className="left-align"
                    key={`${Math.random()}${Date.now()}`}
                  >
                    {message.message}{" "}
                  </div>
                );
              }
            })
          : "You dont have any messages!"}
        {/* {socketMessages.map((message) => {
          if (activeUser === message.sender) {
            return (
              <div className="right-align" key={message.message}>
                {message.message}
              </div>
            );
          } else {
            return (
              <div className="left-align" key={message.message}>
                {message.message}{" "}
              </div>
            );
          }
        })} */}
        {message}
      </ul>
      <div className="control">
        <form action="#" id="send-form" onSubmit={handleSubmit}>
          <div className="message-input-container">
            <input
              name="message"
              type="text"
              placeholder="...message here"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            ></input>
          </div>
          <div className="send-button">
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessageWindow;
