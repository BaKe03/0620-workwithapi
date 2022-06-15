import { useState } from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");

  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('items')));
  
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const [filterType, setFilterType] = useState("");

  const handleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    setItems((prevItems) => [
      { label: itemToAdd, key: uuidv4() },
      ...prevItems,
    ]);

    setItemToAdd("");
  };

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleImportant = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else return item;
      })
    );
  }

  const deleteItem = ({ key }) => {
    //console.log(key);
    const newList = items.filter((item) => item.key !== key);
    setItems(newList);
  }

  const handleFilterItems = (type) => {
    setFilterType(type);
  };
  
  const amountDone = items.length > 0 ? items.filter((item) => item.done).length : 0;
  const amountLeft = items.length - amountDone;

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          value={searchTerm}
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleChangeSearchTerm}
        />
        {/* Item-status-filter */}
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

      {/* List-group */}
      <ul className="list-group todo-list">
          {filteredItems.length > 0 && filteredItems.filter((item) => {
            if (searchTerm === "") {
              return item
            } else if (item.label.toLowerCase().includes(searchTerm.toLowerCase())) {
              return item
            }
          }).map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""} todo-list-item${item.important ? " important" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                > 
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => deleteItem(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right "
                  onClick={() => handleImportant(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
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
