import { useLoaderData, useParams } from "react-router-dom";

import MessageWindow from "./MessageWindow";
import List from "./List";
import { fetchRoomList } from "./apiFunctions";
import { useEffect, useState } from "react";
import { socket } from "../socket";

function Screen() {
  const { userid } = useParams();
  const [activeRoom, setActiveRoom] = useState("");
  const [roomList, setRoomList] = useState([]);
  // const [activeMessages, setActiveMessages] = useState([]);

  // const { data } = useLoaderData();
  console.log(userid);

  useEffect(
    function () {
      const fetchData = async () => {
        const res = await fetchRoomList(userid); //rooms list
        setRoomList(res);
      };

      fetchData();
    },
    [userid]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="app">
      <div className="title">Messenger</div>
      <div className="screen">
        <List list={roomList} setRoom={setActiveRoom} />
        <MessageWindow
          socket={socket}
          roomID={activeRoom}
          activeUser={userid}
        />
      </div>
    </div>
  );
}

export default Screen;
