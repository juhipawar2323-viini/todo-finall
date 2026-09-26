import React, { useState } from 'react';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');

  const handleUpdate = () => {
    onUpdate(todo.id, { title, description });
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="edit-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="edit-textarea"
        />
        <div className="todo-actions">
          <button onClick={handleUpdate} className="btn-success">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-header">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
          />
          <h4>{todo.title}</h4>
        </div>
        {todo.description && <p className="todo-desc">{todo.description}</p>}
      </div>
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)} className="btn-secondary">Edit</button>
        <button onClick={() => onDelete(todo.id)} className="btn-danger">Delete</button>
      </div>
    </div>
  );
};

export default TodoItem;
