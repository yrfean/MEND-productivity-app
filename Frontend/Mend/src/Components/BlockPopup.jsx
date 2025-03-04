import axios from "axios";
import React, { useState } from "react";

const BlockPopup = ({ name, id, email, unblock, onClose }) => {
  const [dlt, setDlt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      if (unblock) {
        await axios.post("http://localhost:3000/userUnBlock", { email });
        alert("User Unblocked");
      } else {
        // First, block the user
        await axios.post("http://localhost:3000/userBlock", { email, id });

        // If delete checkbox is checked, delete the user after blocking
        if (dlt) {
          await axios.post("http://localhost:3000/userDelete", { email, id });
          alert("User Deleted");
        } else {
          alert("User Blocked");
          setIsBlocked(true);
        }
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert("Block that guy first mahnn!");
      }
      if (error.response?.status === 400) {
        alert("user already blocked!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-400 w-[450px] px-4 py-2 rounded">
      <h1 className="text-center text-2xl mt-2 mb-3 font-sans text-red-600 opacity-60 font-bold">
        NOTICE
      </h1>
      <p className="text-red-600 mb-3">
        Are you sure you want to{" "}
        {dlt ? "delete" : unblock ? "Unblock" : "block"} the account of {name}?
      </p>
      <p className="font-sans font-semibold text-justify">
        Blocking will prevent the user from logging in, but you can unblock them
        anytime. Deleting will completely remove the user.
      </p>

      {/* Checkbox for Deleting */}
      <div className={`mt-4 ${unblock ? `opacity-0` : ``}`}>
        <label className="text-red-600 text-md font-medium opacity-60">
          Also delete user
        </label>
        <input
          type="checkbox"
          onChange={() => setDlt(!dlt)}
          checked={dlt}
          className={`ml-2 size-4 cursor-pointer`}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between mt-2 mb-4">
        <button
          onClick={handleAction}
          className={`w-full bg-red-500 text-gray-700 px-3 py-1 font-bold rounded cursor-pointer hover:opacity-80 shadow ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {unblock ? "Unblock User" : dlt ? "Delete User" : "Block User"}
        </button>
      </div>
    </div>
  );
};

export default BlockPopup;
