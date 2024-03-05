import express from 'express';
const router = express.Router();
import { authUser, getUserProfile, logoutUser, registerUser, updateUserProfile } from '../controllers/userController.js';
import {protect} from '../middleware/authMiddleware.js'
import upload from '../config/multer.js';

router.post('/',upload.single('photo'),registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)
router.route('/profile').get(protect , getUserProfile).put( protect , updateUserProfile)


export default router; 