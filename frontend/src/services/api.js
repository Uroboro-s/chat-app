import { API_BASE_URL } from "../constants";

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response;
};

// Fetch all rooms for a user
const fetchRoomList = async (userid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fetchRooms/${userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await handleApiError(response);
    const data = await response.json();

    return data.rooms || [];
  } catch (error) {
    console.error("Error fetching room list:", error);
    throw error;
  }
};

// Fetch all messages in a room
const fetchMessages = async (roomid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fetchMessages/${roomid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await handleApiError(response);
    const data = await response.json();

    return data.messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Add a new message to a room
const addMessage = async (message, sender, roomid) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/sendMessage/${roomid}/${sender}`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `message=${encodeURIComponent(message)}`,
      }
    );

    await handleApiError(response);
    const data = await response.json();

    return data.message;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

export { fetchRoomList, addMessage, fetchMessages };
