import React from "react";
import { Col, Row } from "react-bootstrap";

const TodoItem = ({ item, taskComplete, deleteTask }) => {
  return (
    <Row className="task-row">
      <Col xs={12} className="task">
        <div className={`todo-item ${item.isComplete ? "item-complete" : ""}`}>
          <span
            className={`todo-content ${item.isComplete ? "line-through" : ""}`}
          >
            {item.task}
          </span>
          <div className="author">
            {item.author ? item.author.name : "Unknown Author"}'s task
          </div>
          <div className="button-area">
            <button
              className={`button-delete ${item.isComplete ? "button-disabled" : ""}`}
              onClick={() => deleteTask(item._id)}
              disabled={item.isComplete} 
            >
              Delete
            </button>
            <button
              className={`button-complete ${item.isComplete ? "button-complete-active" : ""}`}
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
