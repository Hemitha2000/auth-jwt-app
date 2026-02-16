const User = require('../models/User');
const jwt = require('jsonwebtoken');
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const emailRegex = /^\S+@\S+\.\S+$/;
    // validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // create user
    const user = await User.create({
      username,
      email,
      password, // hashed automatically
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
    });
  } catch (error) {
    // res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    // res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};
const getUserProfile = async (req, res) => {
  res.status(200).json({
    message: 'User profile fetched successfully',
    user: req.user,
  });
};
module.exports = { registerUser , loginUser , getUserProfile};
