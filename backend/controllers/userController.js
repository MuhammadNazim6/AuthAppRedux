import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc Auth user/set token
// route post/api/users/auth
//access Public
const authUser = asyncHandler(async (req,res) =>{
  const {email , password} = req.body

  const user = await User.findOne({email})

  if(user && (await user.matchPassword(password))){
    generateToken(res,user._id)

    res.status(201).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      mobile:user.mobile,
    })
  }else{
    res.status(401);
    throw new Error('Invalid email or password')
  }

})


// @desc Register new user
// route post/api/users
//access Public
const registerUser = asyncHandler(async (req,res) =>{
  const {name,email,password, mobile } = req.body
  const profile = `backend/public/images/${req.file.filename}`
  console.log(profile);
  const userExists = await User.findOne({email})

if(userExists){
  res.status(400);
  throw new Error('User already exists')
}else{

  const user = await User.create({
    name,
    email,
    password,
    mobile,
    profile
  })
  if(user){
    generateToken(res,user._id)

    res.status(201).json({
      _id:user._id,
      name:user.name,
      email:user.email,
    })
  }else{
    res.status(400);
    throw new Error('Invalid user data')
  }
}

})




// @desc Logout User
// route post/api/users/logout
//access Public
const logoutUser = asyncHandler(async (req,res) =>{
  res.cookie('jwt','',{
    httpOnly: false,
    expires:new Date(0)
  })
  res.status(200).json({message:'User Logged Out'})
})
 


// @desc Get User profile
// route GET/api/users/profile
//access Private
const getUserProfile = asyncHandler(async (req,res) =>{
const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    mobile: req.user.mobile,
    profile: req.user.profile

  }
  res.status(200).json(user)
})



// @desc Update User profile
// route PUT/api/users/profile
//access Private
const updateUserProfile = asyncHandler(async (req,res) =>{
  const user = await User.findById(req.user._id)

  if(user){
    user.name = req.body.name ||  user.name
    user.email = req.body.email ||  user.email
    user.mobile = req.body.mobile || user.mobile

    if(req.body.password){
      user.password = req.body.password || user.password
    }
   const updatedUser =  await user.save()
   res.status(200).json({
    _id:updatedUser._id,
    name:updatedUser.name,
    email:updatedUser.email,
    mobile:updatedUser.mobile
  });
  }else{
    res.status(404)
    throw new Error('User not found')
  }
})



export{
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
}