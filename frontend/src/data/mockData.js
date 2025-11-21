const users = [
  {
    userid: "harsh",
    password: "12345678",
    messages: [
      {
        roomid: "hj",
        messageList: [
          { sender: "harsh", message: "hello" },
          { sender: "jai", message: "hiii" },
          { sender: "harsh", message: "kya kr rhe ho" },
          { sender: "jai", message: "coding" },
          { sender: "harsh", message: "accha. mai ai padh raha" },
          { sender: "jai", message: "hmm aao courtpiece khele" },
          { sender: "harsh", message: "chalo" },
        ],
      },
      {
        roomid: "hvj",
      },
    ],
  },
  {
    userid: "viral",
    password: "1234567",
    messages: [
      {
        roomid: "vj",
      },
      {
        roomid: "hvj",
      },
    ],
  },
  {
    userid: "jai",
    password: "123",
    messages: [
      {
        roomid: "hj",
        messageList: [
          { sender: "harsh", message: "hello" },
          { sender: "jai", message: "hiii" },
          { sender: "harsh", message: "kya kr rhe ho" },
          { sender: "jai", message: "coding" },
          { sender: "harsh", message: "accha. mai ai padh raha" },
          { sender: "jai", message: "hmm aao courtpiece khele" },
          { sender: "harsh", message: "chalo" },
        ],
      },
      {
        roomid: "vj",
        messageList: [
          { sender: "viral", message: ":)" },
          { sender: "jai", message: "yo ho ho ho" },
        ],
      },
      {
        roomid: "hvj",
      },
    ],
  },
];

export { users };
