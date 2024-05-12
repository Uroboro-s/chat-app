const fetchRoomList = async (userid) => {
  const response = await fetch(`http://localhost:3000/fetchRooms/${userid}`, {
    method: "GET",
  });

  const data = await response.json();

  return data.rooms;
};

const fetchMessages = async (roomid) => {
  const response = await fetch(
    `http://localhost:3000/fetchMessages/${roomid}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  return data.messages;
};

const addMessage = async (message, sender, roomid) => {
  const response = await fetch(
    `http://localhost:3000/sendMessage/${roomid}/${sender}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        //   // "Access-Control-Allow-Origin": "http://localhost:5173",
        "Content-Type": "application/x-www-form-urlencoded",
        //   //   "Access-Control-Allow-Origin": "http://localhost:5173",
      },
      body: `message=${message}`,
    }
  );

  const data = await response.json();

  return data;
};

export { fetchRoomList, addMessage, fetchMessages };
