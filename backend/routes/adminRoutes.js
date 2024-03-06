import express from "express";
const adminRoutes = express.Router();
import { protect } from "../middleware/adminAuthMiddleware.js";
import {
  authAdmin,
  blockUnblockUser,
  deleteUser,
  getUsers, 
  logoutAdmin,
  updateUserProfile,
} from "../controllers/adminController.js";

adminRoutes.post("/auth", authAdmin);
adminRoutes.post("/logout", logoutAdmin);
adminRoutes.get("/users", protect, getUsers);
adminRoutes.delete("/users/delete", protect, deleteUser);
adminRoutes.patch("/users/blockUnblock", protect, blockUnblockUser);
adminRoutes.put("/users/updateUser", updateUserProfile);

export default adminRoutes;