import { Router } from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/user", getUser);

export default authRouter;
