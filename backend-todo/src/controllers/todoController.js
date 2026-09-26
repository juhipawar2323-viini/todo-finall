const todoService = require('../services/todoService');

const createTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const todo = await todoService.createTodo(req.user.id, title, description);
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

const getTodos = async (req, res, next) => {
  try {
    const todos = await todoService.getTodos(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully',
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await todoService.getTodoById(id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Todo retrieved successfully',
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Completed must be a boolean' });
    }

    const updatedTodo = await todoService.updateTodo(id, req.user.id, title, description, completed);
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    await todoService.deleteTodo(id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
