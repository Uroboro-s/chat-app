/* eslint-disable react/prop-types */

function List({ list, setRoom }) {
  return (
    <ul className="list">
      {list.map((user) => {
        return (
          <li
            key={user.roomid}
            onClick={() => {
              setRoom(user.roomid);
            }}
          >
            {user.roomid}
          </li>
        );
      })}
    </ul>
  );
}

export default List;
