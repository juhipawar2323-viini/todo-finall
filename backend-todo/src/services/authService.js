const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'todo_jwt_secret_fallback_key_2026';

const registerUser = async (name, email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await userModel.findUserByEmail(normalizedEmail);
  if (existingUser) {
    const error = new Error('Email already exists');
    error.status = 409;
    throw error;
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await userModel.createUser({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const loginUser = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await userModel.findUserByEmail(normalizedEmail);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

module.exports = {
  registerUser,
  loginUser,
};
