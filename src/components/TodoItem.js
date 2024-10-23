import React from "react";
import { Col, Row } from "react-bootstrap";

const TodoItem = ({ item, taskComplete, deleteTask }) => {
  return (
    <Row>
      <Col xs={12} className="task">
        <div className={`todo-item ${item.isComplete ? "item-complete" : ""}`}>
          <div className="todo-content">{item.task}</div>
          <div className="author">
            {item.author ? item.author.name : "Unknown Author"}'s task
          </div>
          <div className="button-area">
            <button
              className="button-delete"
              onClick={() => deleteTask(item._id)}
            >
              Delete
            </button>
            <button
              className="button-delete"
              onClick={() => taskComplete(item._id)}
            >
              {item.isComplete ? ` Uncomplete ` : ` Complete `}
            </button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default TodoItem;
