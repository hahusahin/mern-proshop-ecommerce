import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // Check whether user already exists by searching his/her email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User Already Exists");
  }
  // If not existing user, then create new User in the DB
  const newUser = await User.create({
    name,
    email,
    password, // hashing is done in User model
  });

  // If created successfully
  if (newUser) {
    // Generate jwt token and save it to cookie
    generateToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

// @desc    Auth existing user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error("Invalid Email or Password");
  }
});

// @desc    Logout user and clear the HTTP-only cookie from server
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // Clear the cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged Out Successfully" });
});

// @desc    Get User Profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // I can get the logged in user's id by using the cookie
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @desc    Update User Profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @desc    Get All Users
// @route   GET /api/users
// @access  Private/ADMIN
const getUsers = asyncHandler(async (req, res) => {
  res.send("Get users");
});

// @desc    Get User By ID
// @route   GET /api/users/:id
// @access  Private/ADMIN
const getUserByID = asyncHandler(async (req, res) => {
  res.send("Get user by id");
});

// @desc    Update User
// @route   PUT /api/users/:id
// @access  Private/ADMIN
const updateUser = asyncHandler(async (req, res) => {
  res.send("Update user");
});

// @desc    Delete User
// @route   DELETE /api/users/:id
// @access  Private/ADMIN
const deleteUser = asyncHandler(async (req, res) => {
  res.send("Delete user");
});

export {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
};
