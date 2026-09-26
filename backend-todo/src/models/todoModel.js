const supabase = require('../config/supabase');

const createTodo = async (todoData) => {
  const { data, error } = await supabase
    .from('todos')
    .insert([todoData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getTodosByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const getTodoByIdAndUserId = async (id, userId) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

const updateTodo = async (id, userId, updateData) => {
  const { data, error } = await supabase
    .from('todos')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteTodo = async (id, userId) => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};

module.exports = {
  createTodo,
  getTodosByUserId,
  getTodoByIdAndUserId,
  updateTodo,
  deleteTodo,
};
