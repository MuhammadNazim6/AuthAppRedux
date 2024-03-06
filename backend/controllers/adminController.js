import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";

import generateToken from "../utils/generateToken.js";

// @desc    Auth admin/set token
//route     POST /api/admin/auth
//@access   Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    generateToken(res, admin._id, "adminJwt");

    res.status(201).json({
      _id: admin._id,
      email: admin.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout admin
//route     POST /api/admin/logout
//@access   Public

const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("adminJwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "admin logged out." });
});

// @desc    User data
//route     GET /api/admin/users
//@access   Private

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json({ users });
});

// @desc    Delete user
//route     DELETE /api/admin/users/delete
//@access   Private

const deleteUser = asyncHandler(async (req, res) => {
  console.log('In delete user reached');
  const userId = req.query.id;
  if (!userId) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  const deletedUser = await User.findByIdAndDelete(userId);
  if (deletedUser) {
    res.status(200).json({ message: "User deletion successful" });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Block /Unblock the user
//route     PATCH /api/admin/users/unblock-block
//@access   Private
const blockUnblockUser = asyncHandler(async (req, res) => {
  console.log('reacing in the blockUnblockUser');
  const userId = req.query.id;
  const user = await User.findById(userId).select("-password");
  if (user) {
    user.isBlocked = !user.isBlocked;
    await user.save();
  }
  res.status(200).json(user.isBlocked ? "Blocked" : "Unblocked");
});


// @desc    Update user Profile
//route     PUT /api/admin/users/update
//@access   Private


  const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.body._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;
  
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      const updatedUser = await user.save();
  
      const response = {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
      };
      res.status(200).json(response);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });
  



export { authAdmin,
    logoutAdmin,
    getUsers,
    deleteUser,
    blockUnblockUser,
    updateUserProfile
   };
