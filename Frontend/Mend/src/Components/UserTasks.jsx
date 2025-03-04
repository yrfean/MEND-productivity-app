import React from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserTasks = ({ user, goBack }) => {
  return (
    <>
      {/* back button */}
      <button
        className="absolute py-1 px-3 bg-gray-400 m-5 rounded cursor-pointer hover:bg-gray-500 transition duration-200 "
        onClick={goBack}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="w-screen h-screen p-6 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-400 opacity- mb-6">
          <span className="text-gray-600 ">{user.userName}</span>'s Tasks
        </h1>

        {/* Tasks List */}
        <div className="grid grid-cols-2 gap-6 w-full max-h-[600px] scroll-auto max-w-6xl rounded">
          {user.task.length > 0 ? (
            user.task.map((task) => (
              <div
                key={task._id}
                className="bg-gray-500 w-full h-[170px] flex items-center px-6 rounded-lg text-gray-200 hover:bg-gray-600 transition"
              >
                <div className="ml-4 space-y-2">
                  <h1 className="text-4xl font-bold">{task.title}</h1>
                  <h3 className="opacity-70 text-2xl">{task.description}</h3>
                  <h3 className="opacity-90 text-2xl font-light">
                    status -{" "}
                    <span
                      className={`opacity-90 text-2xl font-semibold  ${
                        task.completed ? `text-green-400` : `text-red-400`
                      }`}
                    >
                      {task.completed ? "Completed" : "not completed"}
                    </span>
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <h2 className="text-gray-400 text-xl">No tasks assigned</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default UserTasks;
