import {
  faMagnifyingGlass,
  faMoon,
  faPenToSquare,
  faPlus,
  faSun,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../Components/DarkModeContext";
import { Reorder } from "framer-motion";
import SpeachReco from "../Components/SpeachReco";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const validationSchema = yup.object({
  title: yup.string().required("You have to name a title"),
  description: yup.string().required("You have to fill the description"),
});

const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "TOGGLE":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };

    case "FILTER":
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
};

const Body = () => {
  const [isOpen, setIsOpen] = useState(false); // CATEGORY OPEN (LIST)
  const [popup, setPopup] = useState(false); // POPUP
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    filter: "ALL",
  }); // SET AS TASK FOR TASK LIST
  const [editIndex, setEditIndex] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [percentage, setPercentage] = useState();
  const [realTime, setRealTime] = useState(new Date());
  const [title, setTitle] = useState(null);
  const [discription, setDiscription] = useState(null);
  const [activeField, setActiveField] = useState("");

  useEffect(() => {
    const time = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(time);
  }, []);

  // console.log(realTime.toLocaleTimeString())

  const handleReorder = (neworder) => {
    dispatch({ type: "SET_TASKS", payload: neworder });
    //  setTasks(neworder);
    localStorage.setItem(
      "reorderedTasks",
      JSON.stringify(neworder.map((task) => task._id))
    );
  };

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/getAllTasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);
      let tasks = response.data.tasks;

      // exist in localStorage
      const storedOrder = JSON.parse(localStorage.getItem("reorderedTasks"));
      if (storedOrder) {
        // Keep only tasks that exist in the new fetched list
        const taskMap = new Map(tasks.map((task) => [task._id, task]));

        tasks = storedOrder.map((id) => taskMap.get(id)).filter(Boolean); // Remove undefined values

        // Append any new tasks that were not in the stored order
        tasks = [
          ...tasks,
          ...tasks.filter((task) => !storedOrder.includes(task._id)),
        ];
      }

      dispatch({ type: "SET_TASKS", payload: tasks });
      setTasks(tasks);
      const completedTasks = tasks.filter((x) => x.completed).length;
      const percentage = (completedTasks / tasks.length) * 100;
      setPercentage(percentage);
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response?.data || error.message
      );
      if (error.response?.status === 400) {
        alert("iam sorry admin havae some beef with you!");
        navigate("/login");
      }
    }
  };

  // Add a new task
  const addTask = async (values) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_URL}/addTask`,
        {
          values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let { tasks } = response.data;
      const storedOrder =
        JSON.parse(localStorage.getItem("reorderedTasks")) || [];

      // Add new task ID to storedOrder
      if (!storedOrder.includes(response.data.task._id)) {
        storedOrder.push(response.data.task._id);
        localStorage.setItem("reorderedTasks", JSON.stringify(storedOrder));
      }
      // dispatch({ type: "ADD", payload: response.data.task });
      fetchTasks();
    } catch (error) {
      console.error(
        "Error adding task:",
        error.response?.data || error.message
      );
    }
  };

  // Update a task
  const updateTask = async (taskId, title, description) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.put(
        `${API_URL}/updateTask`,
        {
          taskId,
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // dispatch({ type: "EDIT", payload: response.data.tasks });
      // console.log(response.data.tasks)
      fetchTasks();
    } catch (error) {
      console.error(
        "Error updating task:",
        error.response?.data || error.message
      );
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      await axios.delete(
        `${API_URL}/deleteTask`,

        {
          data: { taskId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // dispatch({ type: "DELETE", payload: taskId });
      fetchTasks();
    } catch (error) {
      console.error(
        "Error deleting task:",
        error.response?.data || error.message
      );
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId, completed) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    dispatch({ type: "TOGGLE", payload: taskId });

    const updatedTasks = state.tasks.map((task) =>
      task._id === taskId ? { ...task, completed: !completed } : task
    );
    const completedTasksCount = updatedTasks.filter(
      (task) => task.completed
    ).length;
    console.log("Completed tasks after toggle:", completedTasksCount);
    const percentage = (completedTasksCount / state.tasks.length) * 100;
    // console.log(percentage);
    setPercentage(percentage);
    try {
      const response = await axios.put(
        `${API_URL}/updateTask`,
        {
          taskId,
          completed: !completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(
        "Error toggling task:",
        error.response?.data || error.message
      );
    }
  };

  // Searched Tasks
  const searchedTasks = state.tasks.filter((task) => {
    return searchText
      ? task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchText.toLowerCase())
      : null;
  });

  // Filter tasks based on filter
  const filteredTasks = state.tasks.filter((task) => {
    if (state.filter === "COMPLETED") return task.completed;
    if (state.filter === "INCOMPLETED") return !task.completed;
    return true;
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("reorderedTasks");
    return savedTasks ? JSON.parse(savedTasks) : filteredTasks;
  });

  // Set value for transcript to value

  React.useEffect(() => {
    if (title) {
      formik.setFieldValue("title", title);
    }
  }, [title]);
  // console.log(titleTrans)
  React.useEffect(() => {
    if (discription) {
      formik.setFieldValue("description", discription);
    }
  }, [discription]);

  // Formik for task form
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (editIndex !== null) {
        // Update task
        const taskId = state.tasks[editIndex]._id;
        // console.log(taskId)
        updateTask(taskId, values.title, values.description);
      } else {
        // Add new task
        addTask(values);
      }
      formik.resetForm();
      setPopup(false);
    },
  });

  // Fetch tasks on eeeeeeeeeeeeeeeeeeeeeeeaach mount
  useEffect(() => {
    fetchTasks();
  }, []);
  // Reset form when popup is closed
  useEffect(() => {
    if (!popup) {
      formik.resetForm();
      setEditIndex(null);
    }
  }, [popup]);

  const formatTime = (time) => {
    if (!time) {
      return;
    }
    const [hour, minute] = time.split(":").map(Number);
    // console.log(minute);
    const formattedHour = hour % 12 || 12;
    const amOrPm = hour >= 12 ? "PM" : "AM";
    return `${formattedHour}:${minute.toString().padStart(2, 0)} ${amOrPm}`;
  };

  return (
    <div
      className={` flex items-center justify-center h-[598px] ${
        isDarkMode ? `bg-gray-300` : ` bg-gray-200`
      }`}
    >
      {/* outline DIV */}
      <div
        className={`min-w-[800px] rounded relative min-h-[569px] p-2  shadow-lg ${
          isDarkMode ? `bg-gray-500` : `bg-white`
        }`}
      >
        {/* POPUP ------------*/}
        {popup && (
          <>
            <div
              className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 cursor-no-drop"
              onClick={() => setPopup(false)}
            ></div>
            {/* popup card */}
            <div
              className={`z-20 rounded-lg absolute left-1/2 -translate-x-1/2 top-[0%] w-[486px] px-6 py-4 flex flex-col items-center justify-center ${
                isDarkMode ? `bg-gray-500`: `bg-white`
              }`}
            >
              <h1
                className={`text-2xl mt-3 mb-7 font-bold ${
                  isDarkMode ? `text-white` : ``
                }`}
              >
                NEW TASK
              </h1>
              <div className="w-full relative">
                <input
                  type="text"
                  name="title"
                  placeholder="Input your title..."
                  className={`w-full h-9 px-3 py-5 outline outline-1 focus:outline-2 rounded ${
                    isDarkMode
                      ? `outline-white placeholder:text-gray-400`
                      : `outline-gray-500 `
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
                <div className="absolute top-2 right-2 text-gray-500">
                  <SpeachReco
                    setTrans={setTitle}
                    setActiveField={() => setActiveField("title")}
                    activeField={activeField}
                    fieldName="title"
                  />
                </div>
              </div>
              <div className="h-7 mb-2">
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-400">🔴{formik.errors.title}🔴</p>
                )}
              </div>

              <div className="w-full relative">
                <textarea
                  rows={3}
                  type="text"
                  name="description"
                  placeholder="Also description..."
                  className={`w-full resize-none px-3 py-3 outline outline-1 focus:outline-2 rounded ${
                    isDarkMode
                      ? `outline-white placeholder:text-gray-400`
                      : `outline-gray-500`
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                ></textarea>
                <div className="absolute right-2 top-2 text-gray-500">
                  <SpeachReco
                    setTrans={setDiscription}
                    setActiveField={() => setActiveField("description")}
                    activeField={activeField}
                    fieldName="description"
                  />
                </div>
              </div>
              {/* ERROR */}
              <div className="h-4">
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-400">
                    🔴{formik.errors.description}🔴
                  </p>
                )}
              </div>

              {/* Due date  */}
              <h1 className="text-center text-gray-500 mb-2">Due date:</h1>
              <div className="w-full outline mb-5 outline-gray-400 rounded  flex justify-around">
                <input
                  type="date"
                  name="dueDate"
                  className={`p-2 focus:outline-none cursor-pointer ${
                    isDarkMode ? `bg-transparent` : ``
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.dueDate}
                />
                <input
                  type="time"
                  name="dueTime"
                  className={`p-2 focus:outline-none cursor-pointer ${
                    isDarkMode ? `bg-transparent` : ``
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.dueTime}
                />
              </div>

              <div className="w-full flex justify-between mt-2 mb-2">
                <button
                  onClick={() => setPopup(false)}
                  className={`outline font-semibold rounded px-4 py-2 cursor-pointer ${
                    isDarkMode
                      ? `outline-white text-white opacity-80 hover:opacity-60`
                      : `outline-gray-500 hover:opacity-60`
                  }`}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  onClick={formik.handleSubmit}
                  className={`font-semibold rounded px-4 py-2 cursor-pointer shadow-md transition ease-in-out ${
                    isDarkMode
                      ? `text-gray-900 bg-white opacity-80 hover:opacity-70`
                      : `text-white bg-gray-500 hover:bg-gray-700`
                  }`}
                >
                  {editIndex !== null ? "SAVE" : "LESS GO!"}
                </button>
              </div>
            </div>
          </>
        )}
        {/* -------------- */}

        <div className="flex items-center gap-7 p-2">
          <div className="w-full ml-3 relative">
            {/* SEARCH BAR */}
            <input
              type="text"
              name="search"
              placeholder="Search your tasks..."
              className={` w-full py-1 px-2 rounded ${
                isDarkMode
                  ? `placeholder:text-gray-400 opacity-80 outline outline-white`
                  : `outline outline-1 `
              }`}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={`text-xl cursor-pointer  absolute right-2 top-1.5 opacity-65 ${
                isDarkMode
                  ? `text-white opacity-80 hover:opacity-60`
                  : `text-gray-500 hover:text-gray-900`
              }`}
            />
          </div>
          <div className="relative z-3">
            <button
              className={`font-bold py-[5px] px-4 w-36 rounded cursor-pointer ${
                isDarkMode
                  ? `text-gray-500 bg-white opacity-80 hover:opacity-70`
                  : `text-white bg-gray-500 hover:bg-gray-600`
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {state.filter === "COMPLETED"
                ? "COMPLETED ▼"
                : state.filter === "INCOMPLETED"
                ? "INCOMPLETED ▼"
                : "ALL ▼"}
            </button>

            <ul
              className={`absolute z-10 w-full rounded font-semibold cursor-pointer transition-all duration-300 ease-in-out ${
                isOpen
                  ? `opacity-100 scale-100 pointer-events-auto`
                  : `opacity-0 scale-95 pointer-events-none`
              } ${
                isDarkMode
                  ? `bg-white opacity-70`
                  : `text-gray-800 bg-white shadow-md`
              }`}
              style={{
                visibility: isOpen ? "visible" : "hidden", // Ensure the element is hidden when not open
              }}
            >
              <li
                className="outline outline-1 rounded px-2 py-1 cursor-pointer hover:opacity-50"
                onClick={() => {
                  dispatch({ type: "FILTER", payload: "ALL" });
                  setIsOpen(false);
                }}
              >
                All
              </li>
              <li
                className="outline outline-1 rounded px-2 py-1 cursor-pointer hover:opacity-50"
                onClick={() => {
                  dispatch({ type: "FILTER", payload: "COMPLETED" });
                  setIsOpen(false);
                }}
              >
                Completed
              </li>
              <li
                className="outline outline-1 rounded px-2 py-1 cursor-pointer hover:opacity-50"
                onClick={() => {
                  dispatch({ type: "FILTER", payload: "INCOMPLETED" });
                  setIsOpen(false);
                }}
              >
                Incompleted
              </li>
            </ul>
          </div>
          {/* DARK BUTTON */}
          <div className="mr-4">
            <FontAwesomeIcon
              icon={isDarkMode ? faSun : faMoon}
              className={` cursor-pointer ${
                isDarkMode
                  ? `text-white hover:opacity-70 text-2xl`
                  : `text-gray-500 hover:text-gray-800 text-3xl`
              }`}
              onClick={toggleDarkMode}
            />
          </div>
        </div>
        {/* progressive bar */}
        <div
          className={`shado mx-6 px-0 mr-8 rounded-2xl pb-2 flex flex-col justify-center ${
            isDarkMode ? `` : ``
          }`}
        >
          <h1
            className={`text-center font-bold text-gray-600 ${
              isDarkMode ? `text-gray-800` : ``
            }`}
          >
            Progressive Bar
          </h1>
          <div
            className={`relative shadow-md mx-5 h-3 rounded mt-1  ${
              isDarkMode ? `bg-gray-400` : `bg-gray-300`
            }`}
          >
            <div
              className={`absolute h-3 rounded  transition-all duration-1000 ease-in-out ${
                isDarkMode ? `bg-gray-50` : `bg-gray-500`
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-white pr-2">
              {Math.floor(percentage)}%
            </span>
          </div>
        </div>

        {/* TASK LIST */}
        <div className="mt-2 max-h-[380px] overflow-auto">
          {filteredTasks.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/9276421-removebg-preview.png"
                alt="No tasks available"
                className="h-[300px] opacity-70"
              />
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={filteredTasks}
              onReorder={handleReorder}
              className="space-y-3"
            >
              {(searchedTasks.length > 0 ? searchedTasks : filteredTasks).map(
                (task) => (
                  <Reorder.Item
                    key={task._id}
                    value={task}
                    className="cursor-grab active:cursor-grabbing"
                    whileDrag={{
                      opacity: 1.7,
                      scale: 0.95,
                    }}
                  >
                    {/* Task Card Start */}
                    <div className="ml-6 px-6 pb-3 pt-2 w-[665px] rounded-lg shadow bg-gray-50 flex flex-col gap-1">
                      {/* Top Section - Checkbox, Title, Description */}
                      <div className="flex justify-between items-start">
                        {/* Left Side - Checkbox + Text */}
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            className={`mt-1 w-6 h-6 cursor-pointer shadow appearance-none border-2 border-gray-400 rounded-full  ${
                              isDarkMode
                                ? `checked:bg-white`
                                : `checked:bg-gray-400`
                            }`}
                            onChange={() =>
                              toggleTask(task._id, task.completed)
                            }
                          />
                          <div>
                            <h1
                              className={`text-lg font-bold ${
                                task.completed ? "line-through opacity-50" : ""
                              }`}
                            >
                              {task.title.charAt(0).toUpperCase() +
                                task.title.slice(1)}
                            </h1>
                            <p
                              className={`mt-1 text-sm font-medium ${
                                task.completed ? "opacity-50" : "opacity-80"
                              }`}
                            >
                              {task.description ? `- ${task.description}` : ""}
                            </p>
                          </div>
                        </div>

                        {/* Right Side - Icons */}
                        <div className="flex items-center gap-6 mt-5 mr-4 text-gray-500">
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className={`text-lg cursor-pointer hover:text-gray-800 ${
                              isDarkMode ? `text-white` : ``
                            }`}
                            onClick={() => {
                              setEditIndex(
                                state.tasks.findIndex((t) => t._id === task._id)
                              );
                              formik.setValues({
                                title: task.title,
                                description: task.description,
                              });
                              setPopup(true);
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            className={`text-lg cursor-pointer hover:text-gray-800 ${
                              isDarkMode ? `text-white` : ``
                            }`}
                            onClick={() => deleteTask(task._id)}
                          />
                        </div>
                      </div>

                      {/*  Due Date & Time */}
                      <div className="flex justify-between items-center bg-gray-100 shadow rounded mt-1 px-4 py-1 text-sm text-gray-600">
                        {(task.dueDate || task.dueTime) && <p>Task due to:</p>}
                        <p>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("en-IN")
                            : "no due date"}
                        </p>
                        <p>{formatTime(task.dueTime) || "no due time"}</p>
                      </div>
                    </div>
                    {/* Task Card End */}
                  </Reorder.Item>
                )
              )}
            </Reorder.Group>
          )}
        </div>

        {/* Floating Add Button INSIDE Body */}
        <div
          className={`absolute right-4 bottom-4 rounded-full w-[50px] h-12 flex items-center justify-center shadow-sm  cursor-pointer ${
            isDarkMode
              ? `text-gray-500 shadow bg-white opacity-80 hover:opacity-70`
              : `hover:bg-gray-600 shadow-gray-700 bg-gray-500 text-white`
          }`}
          onClick={() => setPopup(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default Body;
