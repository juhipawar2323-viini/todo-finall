import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/todos');
      setTodos(res.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreateTodo = async (todoData) => {
    try {
      const res = await api.post('/api/todos', todoData);
      setTodos([res.data.data, ...todos]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create todo');
    }
  };

  const handleUpdateTodo = async (id, updateData) => {
    try {
      const res = await api.put(`/api/todos/${id}`, updateData);
      setTodos(todos.map(todo => todo.id === id ? res.data.data : todo));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await api.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    }
  };

  return (
    <div className="todos-container">
      <div className="todos-header">
        <h2>MY TODO APPLICATION</h2>
      </div>
      <TodoForm onSubmit={handleCreateTodo} />
      <hr />
      <TodoList
        todos={todos}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Todos;
