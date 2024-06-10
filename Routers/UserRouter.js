import express from "express";
import { forgotPassword, getUser, LoginUser, RegisterUser, resetPassword } from "../Controller/UserController.js";
import authMiddleware from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.post('/register',RegisterUser);
router.post('/login',LoginUser);
router.get('/getuser',authMiddleware,getUser);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:id/:token',resetPassword);

export default router;
