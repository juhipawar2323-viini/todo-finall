const todoModel = require('../models/todoModel');

const createTodo = async (userId, title, description) => {
  return await todoModel.createTodo({
    user_id: userId,
    title,
    description,
  });
};

const getTodos = async (userId) => {
  return await todoModel.getTodosByUserId(userId);
};

const getTodoById = async (id, userId) => {
  const todo = await todoModel.getTodoByIdAndUserId(id, userId);
  if (!todo) {
    const error = new Error('Todo not found');
    error.status = 404;
    throw error;
  }
  return todo;
};

const updateTodo = async (id, userId, title, description, completed) => {
  const existingTodo = await todoModel.getTodoByIdAndUserId(id, userId);
  if (!existingTodo) {
    const error = new Error('Todo not found or unauthorized');
    error.status = 404;
    throw error;
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (completed !== undefined) updateData.completed = completed;
  updateData.updated_at = new Date().toISOString();

  return await todoModel.updateTodo(id, userId, updateData);
};

const deleteTodo = async (id, userId) => {
  const existingTodo = await todoModel.getTodoByIdAndUserId(id, userId);
  if (!existingTodo) {
    const error = new Error('Todo not found or unauthorized');
    error.status = 404;
    throw error;
  }

  await todoModel.deleteTodo(id, userId);
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
