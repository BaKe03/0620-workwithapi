import { useEffect, useState } from "react";
import "./styles.css";
import { TodoistApi } from "@doist/todoist-api-typescript";
import axios from "axios";

const buttons = [
  {
    type: "active",
    label: "Active"
  },
  {
    type: "completed",
    label: "Completed"
  }
];

function App() {
  const [activeItems, setActiveItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);

  const [itemToAdd, setItemToAdd] = useState("");
  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const [searchValue, setSearchValue] = useState("");

  const token = "6aec0b895777d03aee84123bb2109904dfe560cc";
  const api = new TodoistApi(token);
  const myProjectID = "2293678668";

  /*api.getProjects()
    .then((projects) => console.log(projects))
    .catch((error) => console.log(error))*/

  useEffect(() => {
    api
      .getTasks()
      .then((tasks) => {
        setActiveItems(tasks);
      })
      .catch((error) => console.log(error));
  });

  useEffect(() => {
    axios
      .get("https://api.todoist.com/sync/v8/completed/get_all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(
        (response) => {
          //console.log(response.data.items);
          setCompletedItems(response.data.items);
        },
        [searchValue]
      );
  });

  const handleAddItem = () => {
    api.addTask({ content: itemToAdd, projectId: myProjectID }).then((task) => {
      setActiveItems([...activeItems, task]);
    });
    setItemToAdd("");
  };

  const toggleItemDone = ({ id, completed }) => {
    api.closeTask(id).then((isSuccess) => {
      setActiveItems(
        activeItems.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              completed: !completed
            };
          }
          return item;
        })
      );
    });
  };

  const [filterType, setFilterType] = useState("active");
  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />

        {/* Buttons */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active-list-group */}
      <ul className="list-group todo-list">
        {filterType === "active" &&
          activeItems.length > 0 &&
          activeItems.map((item) => (
            <li key={item.id} className="list-group-item">
              <span
                className={`todo-list-item${item.completed ? " done" : ""}`}
              >
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Completed-list-group */}
      <ul className="list-group todo-list">
        {filterType === "completed" &&
          completedItems.length > 0 &&
          completedItems.map((item) => (
            <li key={item.id} className="list-group-item">
              <span
                className={`todo-list-item${item.completed ? " done" : ""}`}
              >
                <span
                  className="todo-list-item-label"
                  //onClick={() => uncompleteItem(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add active tasks form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
