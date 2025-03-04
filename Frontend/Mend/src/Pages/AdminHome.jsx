import React, { useEffect, useState } from "react";
import axios from "axios";
import UserTasks from "../Components/UserTasks";
import { useNavigate } from "react-router-dom";
import Skelton from "../Components/Skelton";
import UndoButton from "../Components/UndoButton";
import BlockPopup from "../Components/BlockPopup";

const AdminHome = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [popup, setPopup] = useState(false);
  const [name, setName] = useState(null);
  const [id, setId] = useState(null);
  const [email, setEmail] = useState(null);
  const [unblock, setUnBlock] = useState(false);
  const [blockedEmails, setBlockedEmails] = useState([]);
  const [userTasks, setUserTasks] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getUsers");
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBlocked = async () => {
    try {
      const response = await axios.get("http://localhost:3000/blockedEmails");
      const blockedUsers = response.data.blockedEmails;
      // console.log(blockedUsers)
      const emails = blockedUsers.map((x) => x.email);
      setBlockedEmails(emails);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);
    }
  };
  // console.log(blockedEmails);

  useEffect(() => {
    fetchUsers();
    fetchBlocked();
  }, []);

  if (userTasks) {
    return <UserTasks user={selectedUser} goBack={() => setUserTasks(false)} />;
  }

  return (
    <>
      {/* POPUP */}
      {popup && (
        <div
          className="fixed z-30 inset-0 flex items-center justify-center backdrop-blur-xs"
          onClick={() => setPopup(false)}
        >
          <div className="mb-40" onClick={(e) => e.stopPropagation()}>
            <BlockPopup
              name={name}
              id={id}
              email={email}
              unblock={unblock}
              onClose={() => setPopup(false)}
            />
          </div>
        </div>
      )}

      {/* Undo Button */}
      <UndoButton />

      <div className="w-screen h-screen p-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold opacity-30 mb-6">Users</h1>

        {/* Users Grid */}
        <div className="grid grid-cols-2 gap-6 w-full max-h-[600px] overflow-y-scroll max-w-6xl rounded">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="bg-gray-500 w-full h-[170px] flex items-center justify-between px-6 rounded-lg text-gray-200 cursor-pointer hover:bg-gray-600 transition"
                onClick={() => {
                  setUserTasks(true);
                  setSelectedUser(user);
                }}
              >
                {/* User Details */}
                <div className="flex items-center">
                  <div className="w-[120px] h-[120px]">
                    <img
                      src={user.image}
                      alt="profile pic"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-xl font-bold">{user.userName}</h1>
                    <h3 className="opacity-70 text-sm">{user.email}</h3>
                    <h2 className="text-sm font-semibold mt-1">
                      Tasks: {user.task.length}
                    </h2>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 items-center text-black">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setName(user.userName);
                      setPopup(true);
                      setId(user._id);
                      setEmail(user.email);
                      setUnBlock(false); // Set for blocking
                    }}
                    className={`px-3 py-1 w-full rounded shadow-sm  bg-gray-200 font-semibold hover:text-red-700 transition ${
                      blockedEmails.includes(user.email)
                        ? `text-red-500 cursor-none`
                        : `text-gray-700`
                    }`}
                  >
                    {blockedEmails.includes(user.email) ? "Blocked" : "Block"}
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      setUnBlock(true);
                      setPopup(true);
                      setId(user._id);
                      setEmail(user.email);
                    }}
                    className="px-3 py-1 rounded text-gray-700 bg-gray-100 shadow-sm font-semibold hover:text-green-700 transition"
                  >
                    Unblock
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Skelton />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminHome;
