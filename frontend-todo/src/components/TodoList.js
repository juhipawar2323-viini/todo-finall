import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onUpdate, onDelete, loading, error }) => {
  if (loading) return <div className="loading">Loading todos...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (todos.length === 0) return <div className="empty-state">No todos found. Create one!</div>;

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onUpdate={onUpdate} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default TodoList;
